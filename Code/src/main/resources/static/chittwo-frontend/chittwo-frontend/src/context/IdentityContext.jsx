import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "chittwo:identity";
const IdentityContext = createContext(null);

/**
 * ChitTwo's backend has no authentication or user model - MessageRequest.sender
 * is just a free-text string. We stand in a lightweight "who am I" identity,
 * kept in localStorage, that's attached to every message this browser sends.
 */
export function IdentityProvider({ children }) {
  const [name, setNameState] = useState(() => localStorage.getItem(STORAGE_KEY) || "");

  useEffect(() => {
    if (name) localStorage.setItem(STORAGE_KEY, name);
  }, [name]);

  function setName(next) {
    const trimmed = next.trim();
    setNameState(trimmed);
  }

  function clearName() {
    localStorage.removeItem(STORAGE_KEY);
    setNameState("");
  }

  return (
    <IdentityContext.Provider value={{ name, setName, clearName }}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error("useIdentity must be used within IdentityProvider");
  return ctx;
}
