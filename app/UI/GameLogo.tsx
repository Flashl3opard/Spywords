import React from "react";

type SpyWordsLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "text-3xl",
  md: "text-5xl",
  lg: "text-7xl",
};

const SpyWordsLogo: React.FC<SpyWordsLogoProps> = ({
  size = "lg",
  className = "",
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Radar Dot */}
      <div className="absolute -left-6 top-2 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-70" />
      <div className="absolute -left-6 top-2 w-4 h-4 bg-green-500 rounded-full" />

      {/* Logo Text */}
      <h1
        className={`
          ${sizes[size]}
          font-extrabold
          italic
          tracking-widest
          relative
        `}
        style={{
          fontFamily: "'Luckiest Guy', cursive",
          WebkitTextStroke: "3px black",
          color: "#22c55e",
          textShadow: `
            0 0 10px #22c55e,
            0 0 20px #16a34a,
            3px 3px 0px black
          `,
        }}
      >
        <span className="text-green-400">SPY</span>
        <span className="text-white ml-3">WORDS</span>
      </h1>

      {/* Scan Line Overlay */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)]
          bg-[length:100%_4px]
          opacity-30
        "
      />
    </div>
  );
};

export default SpyWordsLogo;
