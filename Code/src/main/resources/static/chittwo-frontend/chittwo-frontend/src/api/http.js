const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Minimal fetch wrapper around the ChitTwo REST API (GroupController).
 * Keeps error handling in one place so components/hooks stay declarative.
 */
async function request(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" ? data : null) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return data;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export { request, ApiError, BASE_URL };
