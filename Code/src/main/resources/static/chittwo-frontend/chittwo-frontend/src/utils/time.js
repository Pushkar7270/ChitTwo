/**
 * Backend serializes Message.timeSent (java.time.LocalDateTime) as an ISO-8601
 * string (Spring Boot disables WRITE_DATES_AS_TIMESTAMPS by default), e.g.
 * "2026-07-29T14:05:32.118". No explicit timezone is sent, so we treat it as
 * local time, which matches what the server's LocalDateTime.now() meant.
 */
export function parseServerTime(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatBubbleTime(value) {
  const d = parseServerTime(value);
  if (!d) return "";
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function formatListTime(value) {
  const d = parseServerTime(value);
  if (!d) return "";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
