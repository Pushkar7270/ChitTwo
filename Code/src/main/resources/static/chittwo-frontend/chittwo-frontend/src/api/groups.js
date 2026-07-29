import { request } from "./http";

/**
 * POST /api/v1/group
 * NOTE: the backend's createGroup(@RequestBody String roomName) deserializes
 * the body as a raw JSON string, not a { roomName } object -> body must be a
 * quoted string, e.g. "\"Trip planning\"". `request()` already JSON.stringifies
 * whatever we pass, so we just pass the plain string here.
 */
export function createGroup(roomName) {
  return request("/api/v1/group", { method: "POST", body: roomName });
}

/** GET /api/v1/group/{roomId} -> ChatGroup { roomId, roomName, message[] } */
export function fetchGroup(roomId) {
  return request(`/api/v1/group/${encodeURIComponent(roomId)}`);
}

/**
 * GET /api/v1/group/{roomId}/messages?page=&size=
 * size=0 (default) returns the full history; the backend does not guarantee
 * ordering (see README), so callers should sort by timeSent defensively.
 */
export function fetchMessages(roomId, { page, size } = {}) {
  const params = new URLSearchParams();
  if (page !== undefined) params.set("page", page);
  if (size !== undefined) params.set("size", size);
  const qs = params.toString();
  return request(
    `/api/v1/group/${encodeURIComponent(roomId)}/messages${qs ? `?${qs}` : ""}`
  );
}
