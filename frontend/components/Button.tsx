import React from "react";

type ButtonProps = {
  text?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  text = "SELECT",
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <div className="p-2 flex items-center justify-center">
      <div
        className={`relative transform skew-x-[-10deg] ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <div className="absolute inset-0 translate-y-[6px] rounded-xl bg-amber-900 border-[4px] border-black z-0" />

        <button
          onClick={onClick}
          disabled={disabled}
          className={`
            group relative z-10 flex items-center justify-center
            px-8 py-3
            rounded-xl border-[4px] border-black
            bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500
            transition-all duration-150 ease-out
            hover:-translate-y-1 active:translate-y-[5px]
            hover:brightness-110
            ${className}
          `}
        >
          <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-b from-white/70 via-white/20 to-transparent opacity-70 group-hover:opacity-90 transition" />
          <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_-4px_0_rgba(0,0,0,0.25)]" />

          <span
            className="relative z-20 block skew-x-[10deg] text-2xl leading-none tracking-wide text-white"
            style={{
              fontFamily: "'Luckiest Guy', cursive",
              WebkitTextStroke: "2px black",
              textShadow: "2px 2px 0px black",
            }}
          >
            {text}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Button;
