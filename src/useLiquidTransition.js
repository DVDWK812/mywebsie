import { useCallback, useEffect, useRef, useState } from "react";

// A pressure wave opens the liquid from its core; the next chapter follows immediately.
export default function useLiquidTransition() {
  const layer = useRef(null);
  const surface = useRef(null);
  const animations = useRef([]);
  const mounted = useRef(true);
  const expansion = useRef({
    active: false,
    startedAt: 0,
    duration: 660,
    openingAt: 0,
    openingDuration: 180,
  });
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      animations.current.forEach((animation) => animation.cancel());
    };
  }, []);

  const leaveHome = useCallback(async (navigate) => {
    const overlay = layer.current;
    const orb = surface.current;
    if (!overlay || !orb || !orb.animate) {
      navigate();
      return;
    }
    const rect = orb.getBoundingClientRect();
    const x = innerWidth / 2 - (rect.left + rect.width / 2);
    const y = innerHeight / 2 - (rect.top + rect.height / 2);
    const scale =
      (Math.hypot(innerWidth, innerHeight) /
        (Math.min(rect.width, rect.height) * 0.58)) *
      1.12;
    setPhase("expanding");
    expansion.current = {
      active: true,
      startedAt: performance.now(),
      duration: 660,
      openingAt: 0,
      openingDuration: 180,
      openingExtent:
        (Math.hypot(innerWidth, innerHeight) / (rect.width * scale)) * 0.55 +
        0.025,
    };
    let navigated = false;
    try {
      const swell = orb.animate(
        [
          { transform: "translate3d(0, 0, 0) scale(1)", offset: 0 },
          { transform: "translate3d(0, 0, 0) scale(.94, 1.035)", offset: 0.13 },
          {
            transform: `translate3d(${x * 0.16}px, ${y * 0.16}px, 0) scale(1.22, 1.12)`,
            offset: 0.29,
          },
          {
            transform: `translate3d(${x * 0.6}px, ${y * 0.6}px, 0) scale(${scale * 0.53}, ${scale * 0.58})`,
            offset: 0.64,
          },
          {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
            offset: 1,
          },
        ],
        {
          duration: expansion.current.duration,
          easing: "cubic-bezier(.4, 0, .65, 1)",
          fill: "forwards",
        },
      );
      animations.current = [swell];
      await swell.finished;
      if (!mounted.current) return;
      navigate();
      navigated = true;
      expansion.current.openingAt = performance.now();
      setPhase("revealing");
      const reveal = overlay.animate(
        [
          { opacity: 1, offset: 0 },
          { opacity: 1, offset: 0.45 },
          { opacity: 0, offset: 1 },
        ],
        {
          duration: expansion.current.openingDuration,
          easing: "ease-out",
          fill: "forwards",
        },
      );
      animations.current.push(reveal);
      await reveal.finished;
    } catch {
      if (mounted.current && !navigated) navigate();
    } finally {
      if (mounted.current) {
        overlay.style.opacity = "0";
        setPhase("idle");
      }
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
      expansion.current.active = false;
    }
  }, []);
  return { layer, surface, phase, leaveHome, expansion };
}
