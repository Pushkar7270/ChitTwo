import { useState } from "react";
import { LayoutGrid, MessageCircle, CheckSquare, Star, Settings } from "lucide-react";
import Avatar from "../common/Avatar";
import { useIdentity } from "../../context/IdentityContext";
import "./IconRail.css";

const PLACEHOLDER_ITEMS = [
  { icon: LayoutGrid, label: "Dashboard (not built - this app is chat-only)" },
  { icon: CheckSquare, label: "Tasks (not part of the ChitTwo backend)" },
  { icon: Star, label: "Favorites (not part of the ChitTwo backend)" },
];

export default function IconRail() {
  const { name, clearName } = useIdentity();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="icon-rail">
      <div className="icon-rail__identity">
        <button
          className="icon-rail__avatar-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Switch display name"
        >
          <Avatar name={name} size={40} ringed />
        </button>
        {menuOpen && (
          <div className="icon-rail__menu">
            <p className="icon-rail__menu-name">{name}</p>
            <button
              onClick={() => {
                clearName();
                setMenuOpen(false);
              }}
            >
              Use a different name
            </button>
          </div>
        )}
      </div>

      <nav className="icon-rail__nav">
        <button className="icon-rail__item icon-rail__item--active" title="Chats">
          <MessageCircle size={20} />
        </button>
        {PLACEHOLDER_ITEMS.map(({ icon: Icon, label }) => (
          <button key={label} className="icon-rail__item" title={label} disabled>
            <Icon size={20} />
          </button>
        ))}
      </nav>

      <button className="icon-rail__item icon-rail__item--settings" title="Settings" disabled>
        <Settings size={20} />
      </button>
    </aside>
  );
}
