const URL_RE = /(https?:\/\/[^\s]+)/i;
const IMAGE_RE = /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i;

/**
 * The backend only stores Message.content as plain text - there is no file
 * upload endpoint. As a lightweight, honest stand-in for "attachments", we
 * detect when a message is (or contains) a URL and render it as a link or
 * image-preview card instead of plain text. Anything else is a normal bubble.
 */
export function describeContent(content = "") {
  const match = content.match(URL_RE);
  if (!match) return { kind: "text", text: content };

  const url = match[1];
  const isWholeMessage = content.trim() === url;
  if (!isWholeMessage) return { kind: "text", text: content };

  if (IMAGE_RE.test(url)) return { kind: "image", url };
  return { kind: "link", url };
}
