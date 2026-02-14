import React from "react";

type Button1Props = {
  text?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const Button1: React.FC<Button1Props> = ({
  text = "SELECT",
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <div className="p-10 flex items-center justify-center">
      {/* Skew Wrapper */}
      <div
        className={`
          relative
          transform skew-x-[-10deg]
          ${disabled ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        {/* ===== Bottom Base (3D Layer) ===== */}
        <div
          className="
            absolute inset-0
            translate-y-[10px]
            rounded-xl
            bg-[#92400e]
            border-[5px] border-black
            z-0
          "
        />

        {/* ===== Main Button ===== */}
        <button
          onClick={onClick}
          disabled={disabled}
          className={`
            group
            relative
            z-10
            flex items-center justify-center
            px-14 py-4 md:px-24 md:py-6
            rounded-xl
            border-[5px] border-black
            bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500
            
            /* Lift physics */
            transition-all duration-150 ease-out
            hover:-translate-y-1
            active:translate-y-[8px]
            
            /* Glow */
            hover:brightness-110
            
            ${className}
          `}
        >
          {/* ===== Top Gloss Highlight ===== */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              rounded-lg
              bg-gradient-to-b
              from-white/70
              via-white/20
              to-transparent
              opacity-70
              group-hover:opacity-90
              transition
            "
          />

          {/* ===== Inner Shadow Rim ===== */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              rounded-lg
              shadow-[inset_0_-6px_0_rgba(0,0,0,0.25)]
            "
          />

          {/* ===== Text ===== */}
          <span
            className="
              relative z-20
              block
              skew-x-[10deg]
              text-4xl md:text-5xl
              leading-none
              tracking-wide
              text-white
            "
            style={{
              fontFamily: "'Luckiest Guy', cursive",
              WebkitTextStroke: "2.5px black",
              textShadow: "3px 3px 0px black",
            }}
          >
            {text}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Button1;
