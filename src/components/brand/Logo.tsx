import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const iconDimensions = {
    sm: { w: 28, h: 28 },
    md: { w: 36, h: 36 },
    lg: { w: 44, h: 44 },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Geometric brand mark: Land parcel polygon + document lines + protective shield checkmark */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer Land Parcel Geometric Boundary */}
        <path
          d="M6 14L24 5L42 14V34L24 43L6 34V14Z"
          fill="#176B45"
          fillOpacity="0.1"
          stroke="#176B45"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Folded Document Sheet Base */}
        <path
          d="M15 15H31L35 19V33C35 34.1 34.1 35 33 35H15C13.9 35 13 34.1 13 33V17C13 15.9 13.9 15 15 15Z"
          fill="#FFFFFF"
          stroke="#24312B"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Subtle Deed Line Markings */}
        <path d="M17 21H27" stroke="#D6A84F" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M17 25H29" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 29H25" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Protective Shield / Checkmark for Verification */}
        <circle cx="34" cy="32" r="7" fill="#176B45" stroke="#FFFFFF" strokeWidth="2" />
        <path
          d="M31.5 32L33.2 33.7L36.8 30.2"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className="font-bold tracking-tight text-[#24312B] text-lg">
              JomiGuard
            </span>
            <span className="font-bold text-[#176B45] text-lg">AI</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mt-0.5">
            Bangladesh Land Tech
          </span>
        </div>
      )}
    </div>
  );
};
