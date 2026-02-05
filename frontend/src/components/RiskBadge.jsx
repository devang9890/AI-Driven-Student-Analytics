export default function RiskBadge({ risk }) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold inline-block border";

  const styles = {
    LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
    HIGH: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const normalized = String(risk || "")
    .toUpperCase()
    .replace(" RISK", "")
    .trim();

  return (
    <span className={`${base} ${styles[normalized] || ""}`}>
      {risk}
    </span>
  );
}
