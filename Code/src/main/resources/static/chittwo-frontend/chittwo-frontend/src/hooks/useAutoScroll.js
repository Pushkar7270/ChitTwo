import { useEffect, useRef } from "react";

export function useAutoScroll(dependency) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [dependency]);

  return ref;
}
