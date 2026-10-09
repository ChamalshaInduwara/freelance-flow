import React from "react";

const Logo = ({ size = "normal", showText = true, className = "" }) => {
  const iconSize = size === "small" ? 30 : size === "large" ? 44 : 36;
  const fontSize = size === "small" ? "1.15rem" : size === "large" ? "1.75rem" : "1.35rem";

  return (
    <div
      className={`brand-logo-container ${size} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "small" ? "8px" : "12px",
        userSelect: "none",
      }}
    >
      <div
        className="logo-icon-wrapper"
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: size === "small" ? "8px" : "12px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.35)",
          flexShrink: 0,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <svg
          width={iconSize * 0.6}
          height={iconSize * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V7C20 7.55228 19.5523 8 19 8H8C7.44772 8 7 8.44772 7 9V11C7 11.5523 7.44772 12 8 12H16C16.5523 12 17 12.4477 17 13V14C17 14.5523 16.5523 15 16 15H8C7.44772 15 7 15.4477 7 16V18C7 19.1046 6.10457 20 5 20C4.44772 20 4 19.5523 4 19V6Z"
            fill="white"
          />
          <circle cx="18" cy="17" r="2.5" fill="#5EEAD4" />
        </svg>
      </div>

      {showText && (
        <span
          className="brand-logo-text"
          style={{
            fontSize: fontSize,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
            color: "var(--brand-text-color, #ffffff)",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          Freelance
          <span
            style={{
              background: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Flow
          </span>
        </span>
      )}
    </div>
  );
};

export default Logo;
