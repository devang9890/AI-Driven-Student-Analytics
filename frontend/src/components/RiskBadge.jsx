export default function RiskBadge({ risk }) {
  const base =
    "px-3 py-1 rounded-full text-sm font-semibold inline-block";

  const styles = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-red-100 text-red-700",
  };

  return (
    <span className={`${base} ${styles[risk] || ""}`}>
      {risk}
    </span>
  );
}
