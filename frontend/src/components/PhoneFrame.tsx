import { ReactNode } from "react";

interface PhoneFrameProps {
  isExpanded: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * PhoneFrame Component
 * Phone mockup anchored at bottom in resting state, slides upward to center when expanded.
 * Dark charcoal body (#1a1a1a) with silver-gray bezel (#3a3a3a), notch at top, NO drop shadow.
 */
export default function PhoneFrame({
  isExpanded,
  onClose,
  children,
}: PhoneFrameProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Phone mockup frame */}
      <div
        className={`relative pointer-events-auto transition-transform duration-500 ease-out ${
          isExpanded
            ? "w-full max-w-2xl h-[85vh] translate-y-0"
            : "w-80 h-[640px] translate-y-[280px]"
        }`}
        style={{
          borderRadius: "2.5rem",
          border: "2px solid #3a3a3a",
          backgroundColor: "#1a1a1a",
          overflow: "hidden",
        }}
      >
        {/* Notch bar at top center */}
        <div
          className="absolute top-3 left-1/2 transform -translate-x-1/2 z-50"
          style={{
            width: "140px",
            height: "28px",
            backgroundColor: "#000000",
            borderRadius: "0 0 24px 24px",
          }}
        />

        {/* Phone screen interior background */}
        <div className="absolute inset-0 bg-[#0d0d0d] rounded-[2.4rem]" />

        {/* Close button (only visible when expanded) */}
        {isExpanded && (
          <button
            onClick={onClose}
            className="absolute top-8 left-6 z-50 text-white/60 hover:text-white transition-colors duration-200 pointer-events-auto"
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
            isExpanded ? "pt-20 px-6 pb-6" : "pt-10 px-4 pb-4"
          }`}
        >
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
