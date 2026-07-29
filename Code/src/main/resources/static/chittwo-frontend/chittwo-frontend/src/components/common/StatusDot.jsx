import "./StatusDot.css";

const COLORS = {
  online: "var(--color-online)",
  connecting: "#f5b942",
  offline: "var(--text-muted)",
  error: "var(--color-danger)",
};

export default function StatusDot({ state = "offline" }) {
  return <span className="status-dot" style={{ background: COLORS[state] }} />;
}
