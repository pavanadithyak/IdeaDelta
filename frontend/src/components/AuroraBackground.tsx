/**
 * AuroraBackground Component
 * Fixed full-viewport background with aurora glow gradient.
 * Positioned behind all content with low z-index.
 */
export default function AuroraBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(
            ellipse 200% 100% at 50% -20%,
            #cc66aa 0%,
            #e87ab0 15%,
            #3366ff 35%,
            #1a3a8f 55%,
            #0d0f1a 75%,
            #0a0a0f 100%
          )
        `,
      }}
    />
  );
}
