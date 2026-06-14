import { ReactNode } from "react";

interface PhoneFrameProps {
  isExpanded: boolean;
  onClose: () => void;
  isLoading: boolean;
  children: ReactNode;
}

/**
 * PhoneFrame Component
 * 2.5D phone mockup — bottom-anchored in resting state, slides up to center when expanded.
 * Dark charcoal body with linear gradient, two-tone bezel, side buttons, notch, and screen glow.
 */
export default function PhoneFrame({
  isExpanded,
  onClose,
  isLoading,
  children,
}: PhoneFrameProps) {
  return (
    <div
      className={`pointer-events-none transition-all duration-500 ease-out ${
        isExpanded
          ? "fixed inset-0 flex items-center justify-center z-40"
          : "absolute bottom-0 left-1/2 -translate-x-1/2"
      }`}
    >
      {/* Phone body (outer shell) */}
      <div
        className={`relative pointer-events-auto transition-all duration-500 ease-out ${
          isExpanded ? "w-[420px] h-[88vh]" : "w-[360px] h-[620px]"
        }`}
        style={{
          borderRadius: "3rem",
          border: "4px solid #4a4a4a",
          background: "linear-gradient(180deg, #242424 0%, #141414 100%)",
          transform: isExpanded ? "translateY(0)" : "translateY(35%)",
          boxShadow: isExpanded
            ? "inset 0 0 0 2px rgba(255,255,255,0.05), 0 0 60px rgba(99,102,241,0.2), 0 0 120px rgba(99,102,241,0.1)"
            : "inset 0 0 0 2px rgba(255,255,255,0.05)",
        }}
      >
        {/* Volume buttons — left side */}
        <div className="absolute left-[-6px] top-[100px] w-1.5 h-8 bg-[#2a2a2a] rounded-full" />
        <div className="absolute left-[-6px] top-[140px] w-1.5 h-8 bg-[#2a2a2a] rounded-full" />

        {/* Power button — right side */}
        <div className="absolute right-[-6px] top-[120px] w-1.5 h-10 bg-[#2a2a2a] rounded-full" />

        {/* Screen interior */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            borderRadius: "calc(3rem - 4px)",
            background: "#0a0d14",
            backgroundImage:
              "radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.08) 0%, transparent 70%)",
            boxShadow: "inset 0 0 40px rgba(99,102,241,0.06)",
          }}
        >
          {/* Notch */}
          <div
            className={`absolute top-3 left-1/2 -translate-x-1/2 w-24 h-2 rounded-full z-50 ${
              isLoading
                ? "bg-indigo-500/60 animate-pulse"
                : "bg-black"
            }`}
          />

          {/* Close button (only visible when expanded) */}
          {isExpanded && (
            <button
              onClick={onClose}
              className="absolute top-3 left-4 z-50 text-white/60 hover:text-white transition-colors duration-200 pointer-events-auto"
              aria-label="Close expanded view"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Phone screen content area */}
          <div
            className={`relative w-full h-full flex flex-col transition-all duration-500 ease-out ${
              isExpanded ? "pt-20 px-5 pb-4" : "pt-10 px-4 pb-4"
            }`}
          >
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
