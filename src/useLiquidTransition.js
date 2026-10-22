import { useCallback, useEffect, useRef, useState } from "react";

// Enlarge the existing WebGL surface, then reveal the chapter beneath it.
export default function useLiquidTransition() {
  const layer = useRef(null);
  const surface = useRef(null);
  const animations = useRef([]);
  const mounted = useRef(true);
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
    let navigated = false;
    try {
      const expansion = orb.animate(
        [
          { transform: "translate3d(0, 0, 0) scale(1)" },
          { transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` },
        ],
        {
          duration: 1050,
          easing: "cubic-bezier(.55, 0, .15, 1)",
          fill: "forwards",
        },
      );
      animations.current = [expansion];
      await expansion.finished;
      if (!mounted.current) return;
      navigate();
      navigated = true;
      setPhase("revealing");
      const reveal = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 380,
        easing: "ease-out",
        fill: "forwards",
      });
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
    }
  }, []);
  return { layer, surface, phase, leaveHome };
}
