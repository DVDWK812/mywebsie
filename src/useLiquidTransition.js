import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => value * value * (3 - 2 * value);
const COVER = 0.72;

// One reversible timeline drives the shell, pressure wave, iris and chapter swap.
export default function useLiquidTransition() {
  const layer = useRef(null);
  const surface = useRef(null);
  const expansion = useRef({ bloom: 0, reveal: 0, openingExtent: 0.32 });
  const progress = useRef(0);
  const target = useRef(0);
  const frame = useRef(0);
  const lastTime = useRef(0);
  const scene = useRef(0);
  const commit = useRef(null);
  const auto = useRef(null);
  const [phase, setPhase] = useState("idle");

  const paint = useCallback((value) => {
    const overlay = layer.current;
    const orb = surface.current;
    if (!overlay || !orb) return;
    // Measure the unscaled parent so reversing and resizing cannot compound transforms.
    const rect = orb.parentElement.getBoundingClientRect();
    const diagonal = Math.hypot(innerWidth, innerHeight);
    const scale =
      (diagonal / (Math.min(rect.width, rect.height) * 0.58)) * 1.12;
    const growth = smooth(clamp(value / COVER));
    const reveal = smooth(clamp((value - COVER) / (1 - COVER)));
    const size = Math.exp(Math.log(scale) * growth);
    const stretch = Math.sin(growth * Math.PI) * 0.055;
    const x = innerWidth / 2 - (rect.left + rect.width / 2);
    const y = innerHeight / 2 - (rect.top + rect.height / 2);
    orb.style.transform = `translate3d(${x * growth}px, ${y * growth}px, 0) scale(${size * (1 + stretch)}, ${size * (1 - stretch)})`;
    overlay.style.opacity = String(1 - smooth(clamp((reveal - 0.65) / 0.35)));
    const site = overlay.closest(".site");
    site.style.setProperty(
      "--home-opacity",
      String(1 - smooth(clamp(value / 0.48))),
    );
    site.dataset.liquidProgress = value.toFixed(3);
    expansion.current = {
      bloom: growth,
      reveal,
      openingExtent: (diagonal / (rect.width * scale)) * 0.55 + 0.025,
    };
  }, []);

  useLayoutEffect(() => {
    paint(progress.current);
  });

  const tick = useCallback(
    function update(now) {
      const dt = Math.min(48, lastTime.current ? now - lastTime.current : 16);
      lastTime.current = now;
      if (auto.current) {
        const a = auto.current;
        const elapsed = clamp((now - a.start) / a.duration);
        target.current = a.from + (a.to - a.from) * smooth(elapsed);
        if (elapsed === 1) auto.current = null;
      }
      const difference = target.current - progress.current;
      progress.current += difference * (1 - Math.exp(-dt / 48));
      if (!auto.current && Math.abs(target.current - progress.current) < 0.0008)
        progress.current = target.current;
      const nextScene = progress.current >= COVER ? 1 : 0;
      if (scene.current !== nextScene) {
        scene.current = nextScene;
        commit.current?.(nextScene);
      }
      paint(progress.current);
      const moving = auto.current || progress.current !== target.current;
      const inside = progress.current > 0 && progress.current < 1;
      setPhase(inside || moving ? "scrubbing" : "idle");
      if (moving) frame.current = requestAnimationFrame(update);
      else {
        frame.current = 0;
        lastTime.current = 0;
      }
    },
    [paint],
  );

  const wake = useCallback(() => {
    setPhase("scrubbing");
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  }, [tick]);

  const input = useCallback(
    (delta, onScene) => {
      auto.current = null;
      commit.current = onScene;
      target.current = clamp(target.current + delta);
      wake();
      return target.current;
    },
    [wake],
  );

  const animateTo = useCallback(
    (value, onScene) => {
      commit.current = onScene;
      auto.current = {
        from: progress.current,
        to: value,
        start: performance.now(),
        duration: 520 * Math.abs(value - progress.current) + 80,
      };
      wake();
    },
    [wake],
  );

  const reset = useCallback(
    (value) => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      lastTime.current = 0;
      auto.current = null;
      progress.current = target.current = value;
      scene.current = value >= COVER ? 1 : 0;
      paint(value);
      setPhase("idle");
    },
    [paint],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const engaged = useCallback(
    () =>
      !!auto.current ||
      progress.current !== target.current ||
      (progress.current > 0 && progress.current < 1),
    [],
  );
  const refresh = useCallback(() => paint(progress.current), [paint]);
  return {
    layer,
    surface,
    phase,
    expansion,
    input,
    animateTo,
    reset,
    engaged,
    refresh,
  };
}
