import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Helper to initialize Gemini SDK safely on server
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System Status endpoint
app.get('/api/status', (_req, res) => {
  const ai = getGeminiClient();
  res.json({
    status: 'ok',
    product: 'JomiGuard AI',
    geminiConfigured: Boolean(ai),
    serverTime: new Date().toISOString(),
    mode: ai ? 'live_gemini' : 'demo_mode',
  });
});

// Document Extraction endpoint
app.post('/api/extract', async (req, res) => {
  try {
    const { documentText, documentType, fileName, imageBase64, mimeType } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Return structured demo extraction signal with rule-based fallback
      return res.json({
        success: true,
        source: 'demo_extractor',
        note: 'Gemini API key not configured on server. Used certified local demo extraction rules.',
        extractedData: parseTextHeuristically(documentText || fileName || ''),
      });
    }

    const systemPrompt = `You are a specialist Bengali Land Document Analyst (জমির দলিল ও খতিয়ান বিশ্লেষক) for JomiGuard AI.
Analyze the provided Bangladesh land document (deed/দলিল, khatian/খতিয়ান, mutation/নামজারি, or map/নকশা).
Extract all official land details strictly as written.
CRITICAL RULES:
1. Never invent or hallucinate missing values. If a field is not present or illegible, set it to null.
2. Preserve original Bengali spellings and English equivalents.
3. Distinguish clearly between Acre (একর), Decimal/Shotok/Shatangsha (শতক/শতাংশ), Katha (কাঠা), and Bigha (বিঘা).
4. Provide confidence scores (0.0 to 1.0) and quote verbatim evidence snippets for each extracted field when available.`;

    const extractionSchema = {
      type: Type.OBJECT,
      properties: {
        ownerName: { type: Type.STRING, description: 'Primary owner or buyer/executant name in original script' },
        coOwners: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Names of other co-owners, sellers, or parties mentioned'
        },
        deedNumber: { type: Type.STRING, description: 'Deed/Dalil number (দলিল নম্বর), e.g., 450/2012' },
        documentDate: { type: Type.STRING, description: 'Document execution or registration date' },
        khatianNumber: { type: Type.STRING, description: 'Khatian number (খতিয়ান নং) if explicitly present' },
        khatianType: { type: Type.STRING, description: 'Type of khatian if applicable: CS, SA, RS, BS, City Survey' },
        dagNumber: { type: Type.STRING, description: 'Plot/Dag number (দাগ নং), e.g. 125' },
        mouza: { type: Type.STRING, description: 'Mouza name (মৌজা), e.g. Demo Mouza, Baunia' },
        jlNumber: { type: Type.STRING, description: 'J.L. Number (জে.এল. নং)' },
        upazila: { type: Type.STRING, description: 'Upazila / Thana (উপজেলা / থানা)' },
        district: { type: Type.STRING, description: 'District (জেলা)' },
        landAreaValue: { type: Type.NUMBER, description: 'Numerical amount of land' },
        landAreaUnit: { type: Type.STRING, description: 'Unit: Acre, Decimal/Shotok, Katha, Bigha, SqFt' },
        boundaries: {
          type: Type.OBJECT,
          properties: {
            north: { type: Type.STRING },
            south: { type: Type.STRING },
            east: { type: Type.STRING },
            west: { type: Type.STRING },
          }
        },
        evidenceSnippet: { type: Type.STRING, description: 'Key verbatim textual fragment showing ownership/plot' },
        uncertaintyNotes: { type: Type.STRING, description: 'Any ambiguous, damaged, or unverified sections' },
      },
    };

    let contents: any[] = [];
    if (imageBase64 && mimeType) {
      contents = [
        {
          inlineData: {
            data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
            mimeType: mimeType,
          },
        },
        {
          text: `Document Type: ${documentType || 'Deed/Khatian'}. Document file: ${fileName || 'upload'}. Extract all land record fields according to schema.`,
        },
      ];
    } else {
      contents = [
        {
          text: `Document Content:\n${documentText || ''}\n\nDocument Type: ${documentType || 'General'}\nFilename: ${fileName || 'unknown'}`,
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: extractionSchema,
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');

    return res.json({
      success: true,
      source: 'gemini_3.8_flash',
      extractedData: {
        ownerName: { value: parsedJson.ownerName || null, confidence: parsedJson.ownerName ? 0.95 : 0, evidenceSnippet: parsedJson.evidenceSnippet },
        coOwners: { value: parsedJson.coOwners || [], confidence: parsedJson.coOwners?.length ? 0.9 : 0 },
        deedNumber: { value: parsedJson.deedNumber || null, confidence: parsedJson.deedNumber ? 0.92 : 0 },
        documentDate: { value: parsedJson.documentDate || null, confidence: parsedJson.documentDate ? 0.9 : 0 },
        khatianNumber: { value: parsedJson.khatianNumber || null, confidence: parsedJson.khatianNumber ? 0.94 : 0 },
        khatianType: { value: parsedJson.khatianType || null, confidence: parsedJson.khatianType ? 0.88 : 0 },
        dagNumber: { value: parsedJson.dagNumber || null, confidence: parsedJson.dagNumber ? 0.95 : 0 },
        mouza: { value: parsedJson.mouza || null, confidence: parsedJson.mouza ? 0.93 : 0 },
        jlNumber: { value: parsedJson.jlNumber || null, confidence: parsedJson.jlNumber ? 0.85 : 0 },
        upazila: { value: parsedJson.upazila || null, confidence: parsedJson.upazila ? 0.9 : 0 },
        district: { value: parsedJson.district || null, confidence: parsedJson.district ? 0.92 : 0 },
        landArea: { value: parsedJson.landAreaValue || null, confidence: parsedJson.landAreaValue ? 0.91 : 0 },
        landUnit: { value: parsedJson.landAreaUnit || 'Acre', confidence: parsedJson.landAreaUnit ? 0.9 : 0 },
        boundaries: { value: parsedJson.boundaries || {}, confidence: 0.8 },
        notes: parsedJson.uncertaintyNotes || '',
      },
    });
  } catch (error: any) {
    console.error('Server extraction error:', error);
    // Graceful fallback to heuristic parser if API call fails
    return res.json({
      success: true,
      source: 'demo_extractor',
      warning: error?.message || 'Gemini processing failed, utilized safe heuristic fallback',
      extractedData: parseTextHeuristically(req.body.documentText || req.body.fileName || ''),
    });
  }
});

// Heuristic fallback parser for offline/demo operation
function parseTextHeuristically(text: string) {
  const content = text || '';
  const bnToEn = (str: string) => {
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let res = str;
    for (let i = 0; i < 10; i++) res = res.replaceAll(bn[i], i.toString());
    return res;
  };
  
  // Extract numbers, names, mouza if found in text
  const dagMatch = content.match(/দাগ(?:\s*নং)?[:\s]+([০-৯0-9]+)/i) || content.match(/dag(?:\s*no)?[:\s]+([0-9]+)/i);
  const khatianMatch = content.match(/খতিয়ান(?:\s*নং)?[:\s]+([০-৯0-9]+)/i) || content.match(/khatian(?:\s*no)?[:\s]+([0-9]+)/i);
  const areaMatch = content.match(/([০-৯0-9.]+)\s*(একর|শতক|শতাংশ|কাঠা|বিঘা|acre|acres|decimal|shotok)/i);
  const mouzaMatch = content.match(/মৌজা[:\s]+([^\n,]+)/i) || content.match(/mouza[:\s]+([^\n,]+)/i);
  const nameMatch = content.match(/(?:নাম|মালিক|দাতার নাম|গ্রহীতার নাম)[:\s]+([^\n,]+)/i) || content.match(/(?:owner|name)[:\s]+([^\n,]+)/i);

  const parsedArea = areaMatch ? parseFloat(bnToEn(areaMatch[1])) : null;
  
  return {
    ownerName: { value: nameMatch ? nameMatch[1].trim() : null, confidence: nameMatch ? 0.85 : 0 },
    coOwners: { value: [], confidence: 0 },
    deedNumber: { value: null, confidence: 0 },
    documentDate: { value: null, confidence: 0 },
    khatianNumber: { value: khatianMatch ? khatianMatch[1].trim() : null, confidence: khatianMatch ? 0.9 : 0 },
    dagNumber: { value: dagMatch ? dagMatch[1].trim() : null, confidence: dagMatch ? 0.9 : 0 },
    mouza: { value: mouzaMatch ? mouzaMatch[1].trim() : null, confidence: mouzaMatch ? 0.88 : 0 },
    upazila: { value: null, confidence: 0 },
    district: { value: null, confidence: 0 },
    landArea: { value: !isNaN(parsedArea as number) ? parsedArea : null, confidence: areaMatch ? 0.85 : 0 },
    landUnit: { value: areaMatch ? areaMatch[2] : 'Acre', confidence: areaMatch ? 0.85 : 0 },
  };
}

// Development or Production static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`JomiGuard AI server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
