import { gradientIndexFor, initialsFor } from "../../utils/avatar";
import "./Avatar.css";

/**
 * The backend stores no profile photos (ChatGroup/Message have no avatar
 * field), so every identity gets a deterministic gradient + initials instead
 * of a broken <img>. Same name -> same colors, every time.
 */
export default function Avatar({ name, size = 44, ringed = false }) {
  const idx = gradientIndexFor(name);
  return (
    <div
      className={`avatar${ringed ? " avatar--ringed" : ""}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        background: `var(--grad-avatar-${idx})`,
      }}
      aria-hidden="true"
    >
      {initialsFor(name)}
    </div>
  );
}
