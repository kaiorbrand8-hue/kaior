const NAVY = "#0A0E27";
const GOLD = "#C9A227";

export function buildMonogram(size: number, opts?: { maskable?: boolean }) {
  // Maskable icons get masked into arbitrary shapes (circle, squircle, etc.);
  // only content within an 80%-diameter circle centered in the canvas is
  // guaranteed visible. A square frame's corners reach further than its
  // edges, so keep the frame small enough that its corners stay inside
  // that safe circle: inset * sqrt(2) / 2 <= 0.4 -> inset <= ~0.566.
  const inset = opts?.maskable ? 0.55 : 0.82;
  const border = Math.max(2, Math.round(size * 0.012));

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: NAVY,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: `${inset * 100}%`,
          height: `${inset * 100}%`,
          border: `${border}px solid ${GOLD}`,
          color: GOLD,
          fontSize: Math.round(size * 0.42),
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        K
      </div>
    </div>
  );
}
