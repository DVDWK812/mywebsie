import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export const CHAPTER_IDS = [
  "home",
  "work",
  "sms-wechat",
  "cloudsea",
  "contact",
];

export default function useChapterScroll(liquid) {
  const scroller = useRef(null);
  const current = useRef(0);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { input, animateTo, reset, engaged, refresh } = liquid;
  const position = useCallback(
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
      history.replaceState(null, "", `#${CHAPTER_IDS[next]}`);
    },
    [reduced],
  );
  const swapScene = useCallback((index) => position(index, true), [position]);
  const goTo = useCallback(
    (index, instant = false) => {
      const next = Math.max(0, Math.min(CHAPTER_IDS.length - 1, index));
      if (
        !instant &&
        !reduced &&
        current.current <= 1 &&
        next <= 1 &&
        (next !== current.current || engaged())
      ) {
        animateTo(next, swapScene);
      } else {
        reset(next === 0 ? 0 : 1);
        position(next, instant);
      }
    },
    [animateTo, engaged, position, reduced, reset, swapScene],
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
      const index = CHAPTER_IDS.indexOf(id === "about" ? "home" : id);
      goTo(index < 0 ? 0 : index, true);
    };
    const canScrollInside = (target, direction) => {
      const inner = target.closest?.("[data-chapter-scroll]");
      if (!inner || inner.scrollHeight <= inner.clientHeight + 2) return false;
      return direction > 0
        ? inner.scrollTop + inner.clientHeight < inner.scrollHeight - 2
        : inner.scrollTop > 2;
    };
    const isEditable = (target) =>
      target.closest?.(
        "input, textarea, select, [contenteditable=true], [role=dialog]",
      );
    const scrubbable = (direction) =>
      !reduced &&
      (engaged() ||
        current.current === 0 ||
        (current.current === 1 && direction < 0));
    const onWheel = (event) => {
      if (
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        !event.deltaY ||
        isEditable(event.target)
      )
        return;
      const direction = Math.sign(event.deltaY);
      if (!engaged() && canScrollInside(event.target, direction)) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheel > 180) {
        total = 0;
        usedGesture = false;
      }
      lastWheel = now;
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? root.clientHeight
            : 1);
      if (scrubbable(direction)) {
        // Keep a long wheel event from skipping the entire reversible timeline.
        const next = input(
          Math.max(-160, Math.min(160, delta)) /
            Math.max(620, root.clientHeight),
          swapScene,
        );
        if (next === 1) {
          usedGesture = true;
          lockedUntil = now + 350;
        }
        return;
      }
      if (now < lockedUntil || usedGesture) return;
      if (Math.sign(total) !== direction) total = 0;
      total += delta;
      if (Math.abs(total) < 35) return;
      usedGesture = true;
      lockedUntil = now + (reduced ? 200 : 750);
      goTo(Math.round(root.scrollTop / root.clientHeight) + direction);
    };
    const onKey = (event) => {
      if (
        document.querySelector(".mobile-nav") ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.defaultPrevented ||
        isEditable(event.target)
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
        goTo(event.key === "Home" ? 0 : CHAPTER_IDS.length - 1, true);
      } else if (event.key in directions) {
        const direction = directions[event.key];
        if (!engaged() && canScrollInside(event.target, direction)) return;
        event.preventDefault();
        if (event.key.startsWith("Arrow") && scrubbable(direction))
          input(direction * 0.13, swapScene);
        else if (!event.repeat)
          goTo(
            engaged() ? (direction > 0 ? 1 : 0) : current.current + direction,
          );
      }
    };
    const onScroll = () => {
      if (engaged()) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (engaged()) return;
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
          if (location.hash !== `#${CHAPTER_IDS[index]}`)
            history.replaceState(null, "", `#${CHAPTER_IDS[index]}`);
        }, 150);
      });
    };
    let touch = null;
    const onTouchStart = (event) => {
      if (event.touches.length !== 1 || isEditable(event.target)) {
        touch = null;
        return;
      }
      const p = event.touches[0];
      touch = {
        x: p.clientX,
        y: p.clientY,
        target: event.target,
        handled: false,
      };
    };
    const onTouchMove = (event) => {
      if (!touch || event.touches.length !== 1) return;
      const p = event.touches[0],
        dy = touch.y - p.clientY,
        dx = Math.abs(touch.x - p.clientX);
      touch.x = p.clientX;
      touch.y = p.clientY;
      if (
        !dy ||
        Math.abs(dy) < dx ||
        (!touch.handled && !scrubbable(Math.sign(dy)))
      )
        return;
      if (!engaged() && canScrollInside(touch.target, Math.sign(dy))) return;
      if (event.cancelable) event.preventDefault();
      touch.handled = true;
      input(
        dy / Math.max(360, Math.min(560, root.clientHeight * 0.75)),
        swapScene,
      );
    };
    const onTouchEnd = () => {
      touch = null;
    };
    const initial = requestAnimationFrame(readHash);
    const resize = new ResizeObserver(() => {
      position(current.current, true);
      refresh();
    });
    resize.observe(root);
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd);
    root.addEventListener("touchcancel", onTouchEnd);
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
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", readHash);
      window.removeEventListener("popstate", readHash);
    };
  }, [goTo, position, reduced, input, engaged, swapScene, refresh]);
  return { scroller, active, goTo };
}
