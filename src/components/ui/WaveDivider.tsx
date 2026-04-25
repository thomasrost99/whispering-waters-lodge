/**
 * SVG wave divider used to transition between sections (e.g. hero → body).
 * `fillColor` should be a CSS custom property reference like "var(--color-warm-white)".
 */
export default function WaveDivider({ fillColor = "var(--color-warm-white)" }: { fillColor?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <path
          d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}
