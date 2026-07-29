import { useState } from "react";
import { useIdentity } from "../../context/IdentityContext";
import "./IdentityGate.css";

export default function IdentityGate({ children }) {
  const { name, setName } = useIdentity();
  const [draft, setDraft] = useState("");

  if (name) return children;

  function handleSubmit(e) {
    e.preventDefault();
    if (draft.trim()) setName(draft);
  }

  return (
    <div className="identity-gate">
      <div className="identity-gate__glow" />
      <form className="identity-card" onSubmit={handleSubmit}>
        <div className="identity-card__mark">C2</div>
        <h1>Welcome to ChitTwo</h1>
        <p>
          ChitTwo doesn't have accounts - pick a display name for this browser.
          It's sent along with every message you post.
        </p>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. Alexa"
          maxLength={40}
        />
        <button type="submit" disabled={!draft.trim()}>
          Start chatting
        </button>
      </form>
    </div>
  );
}
