import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export const CHAPTER_IDS = [
  "home",
  "work",
  "sms-wechat",
  "cloudsea",
  "about",
  "contact",
];

// Native touch snapping; one wheel gesture or navigation key advances one chapter.
export default function useChapterScroll() {
  const scroller = useRef(null);
  const current = useRef(0);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const goTo = useCallback(
    (index, instant = false) => {
      const root = scroller.current;
      if (!root) return;
      const next = Math.max(0, Math.min(CHAPTER_IDS.length - 1, index));
      current.current = next;
      setActive(next);
      root.scrollTo({
        top: next * root.clientHeight,
        behavior: instant || reduced ? "instant" : "smooth",
      });
    },
    [reduced],
  );

  useEffect(() => {
    const root = scroller.current;
    let frame = 0,
      settle = 0,
      lastWheel = 0,
      total = 0,
      lockedUntil = 0,
      usedGesture = false;
    const readHash = () => {
      let id;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        id = "home";
      }
      const index = CHAPTER_IDS.indexOf(id);
      goTo(index < 0 ? 0 : index, true);
    };
    const canScrollInside = (target, direction) => {
      const inner = target.closest?.("[data-chapter-scroll]");
      if (!inner || inner.scrollHeight <= inner.clientHeight + 2) return false;
      return direction > 0
        ? inner.scrollTop + inner.clientHeight < inner.scrollHeight - 2
        : inner.scrollTop > 2;
    };
    const onWheel = (event) => {
      if (
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        !event.deltaY
      )
        return;
      if (
        event.target.closest?.(
          "input, textarea, select, [contenteditable=true]",
        )
      )
        return;
      const direction = Math.sign(event.deltaY);
      if (canScrollInside(event.target, direction)) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheel > 180) {
        total = 0;
        usedGesture = false;
      }
      lastWheel = now;
      if (now < lockedUntil || usedGesture) return;
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? root.clientHeight
            : 1);
      if (Math.sign(total) !== direction) total = 0;
      total += delta;
      if (Math.abs(total) < 35) return;
      usedGesture = true;
      lockedUntil = now + (reduced ? 200 : 750);
      goTo(Math.round(root.scrollTop / root.clientHeight) + direction);
    };
    const onKey = (event) => {
      if (document.querySelector(".mobile-nav")) return;
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.defaultPrevented
      )
        return;
      if (
        event.target.closest?.(
          "input, textarea, select, [contenteditable=true], [role=dialog]",
        )
      )
        return;
      if (
        (event.key === " " || event.key === "Enter") &&
        event.target.closest?.("button, a")
      )
        return;
      const directions = {
        ArrowDown: 1,
        PageDown: 1,
        ArrowUp: -1,
        PageUp: -1,
        " ": event.shiftKey ? -1 : 1,
      };
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        goTo(event.key === "Home" ? 0 : CHAPTER_IDS.length - 1);
      } else if (event.key in directions) {
        if (canScrollInside(event.target, directions[event.key])) return;
        event.preventDefault();
        if (!event.repeat) goTo(current.current + directions[event.key]);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = Math.max(
          0,
          Math.min(
            CHAPTER_IDS.length - 1,
            Math.round(root.scrollTop / root.clientHeight),
          ),
        );
        current.current = index;
        setActive(index);
        clearTimeout(settle);
        settle = setTimeout(() => {
          const id = CHAPTER_IDS[index];
          if (location.hash !== `#${id}`)
            history.replaceState(null, "", `#${id}`);
        }, 150);
      });
    };
    const initial = requestAnimationFrame(readHash);
    const resize = new ResizeObserver(() => goTo(current.current, true));
    resize.observe(root);
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", readHash);
    window.addEventListener("popstate", readHash);
    return () => {
      cancelAnimationFrame(initial);
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      resize.disconnect();
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", readHash);
      window.removeEventListener("popstate", readHash);
    };
  }, [goTo, reduced]);
  return { scroller, active, goTo };
}
