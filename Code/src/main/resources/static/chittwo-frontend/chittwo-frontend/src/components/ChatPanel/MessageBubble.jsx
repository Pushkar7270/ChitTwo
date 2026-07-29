import { Download } from "lucide-react";
import Avatar from "../common/Avatar";
import { formatBubbleTime } from "../../utils/time";
import { describeContent } from "../../utils/linkDetect";
import "./ChatPanel.css";

export default function MessageBubble({ message, isOwn }) {
  const content = describeContent(message.content || "");

  return (
    <div className={`bubble-row${isOwn ? " bubble-row--own" : ""}`}>
      {!isOwn && <Avatar name={message.senderId} size={32} />}
      <div className="bubble-row__stack">
        {!isOwn && <span className="bubble-row__sender">{message.senderId}</span>}
        <div className={`bubble bubble--${isOwn ? "own" : "other"} bubble--${content.kind}`}>
          {content.kind === "text" && content.text}
          {content.kind === "image" && (
            <a href={content.url} target="_blank" rel="noreferrer">
              <img src={content.url} alt="Shared attachment" />
            </a>
          )}
          {content.kind === "link" && (
            <a className="bubble__file" href={content.url} target="_blank" rel="noreferrer">
              <Download size={16} />
              <span>{fileNameFromUrl(content.url)}</span>
            </a>
          )}
        </div>
        <span className="bubble-row__time">{formatBubbleTime(message.timeSent)}</span>
      </div>
      {isOwn && <Avatar name={message.senderId} size={32} />}
    </div>
  );
}

function fileNameFromUrl(url) {
  try {
    const { pathname } = new URL(url);
    const name = pathname.split("/").filter(Boolean).pop();
    return name || url;
  } catch {
    return url;
  }
}
