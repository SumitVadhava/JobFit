/* ──────────────── ATS Score Circle ──────────────── */
const RecruiterAtsScoreCircle = ({ score = 0, size = 64 }) => {
  const sw = 5;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;

  const color =
    score >= 80
      ? "#22c55e"
      : score >= 60
        ? "#eab308"
        : score >= 40
          ? "#f97316"
          : "#ef4444";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={sw}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeDasharray={circ}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <span className="absolute text-sm font-extrabold" style={{ color }}>
        {score}
      </span>
    </div>
  );
};

export default RecruiterAtsScoreCircle;
