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

export default function useLiquidTransition() {
  const layer = useRef(null);
  const surface = useRef(null);
  const expansion = useRef({
    bloom: 0,
    reveal: 0,
    enabled: true,
    scaleX: 1,
    scaleY: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const metrics = useRef(null);
  const progress = useRef(0),
    target = useRef(0),
    frame = useRef(0),
    lastTime = useRef(0);
  const scene = useRef(0),
    commit = useRef(null),
    auto = useRef(null);
  const phaseRef = useRef("idle");
  const [phase, setPhase] = useState("idle");

  const changePhase = useCallback((next) => {
    if (phaseRef.current === next) return;
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const measure = useCallback(() => {
    const overlay = layer.current,
      orb = surface.current;
    if (!overlay || !orb) return;
    const rect = orb.parentElement.getBoundingClientRect();
    const width = innerWidth,
      height = innerHeight;
    metrics.current = {
      width,
      height,
      baseX: rect.width / width,
      baseY: rect.height / height,
      offsetX: ((rect.left + rect.width / 2) / width) * 2 - 1,
      offsetY: 1 - ((rect.top + rect.height / 2) / height) * 2,
      scale:
        (Math.hypot(width, height) /
          (Math.min(rect.width, rect.height) * 0.58)) *
        1.12,
      site: overlay.closest(".site"),
      home: overlay.closest(".site").querySelector(".hero-layout"),
      halo: orb.querySelector(".orb-halo"),
      fallback: overlay.querySelector(".sphere-fallback"),
      orbWidth: rect.width,
      orbHeight: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    };
  }, []);

  const paint = useCallback((value) => {
    const overlay = layer.current,
      m = metrics.current;
    if (!overlay || !m) return;
    const growth = smooth(clamp(value / COVER));
    const reveal = smooth(clamp((value - COVER) / (1 - COVER)));
    const size = Math.exp(Math.log(m.scale) * growth);
    const stretch = Math.sin(growth * Math.PI) * 0.055;
    // Projection changes inside a fixed-size WebGL buffer; no giant CSS texture.
    const visual = expansion.current;
    visual.enabled = value < 1;
    visual.bloom = growth;
    visual.reveal = reveal;
    visual.scaleX = m.baseX * size * (1 + stretch);
    visual.scaleY = m.baseY * size * (1 - stretch);
    visual.offsetX = m.offsetX * (1 - growth);
    visual.offsetY = m.offsetY * (1 - growth);
    overlay.style.opacity = String(1 - smooth(clamp((reveal - 0.65) / 0.35)));
    m.home.style.opacity = String(1 - smooth(clamp(value / 0.48)));
    m.halo.style.opacity = String(1 - growth);
    if (!m.fallback.parentElement.classList.contains("is-rendered")) {
      m.fallback.style.width = `${m.orbWidth * 0.66}px`;
      m.fallback.style.height = `${m.orbHeight * 0.66}px`;
      m.fallback.style.transform = `translate(${m.centerX * (1 - growth) + (m.width / 2) * growth - m.orbWidth * 0.33}px, ${m.centerY * (1 - growth) + (m.height / 2) * growth - m.orbHeight * 0.33}px) scale(${size})`;
    }
    m.site.dataset.liquidProgress = value.toFixed(3);
  }, []);

  const refresh = useCallback(() => {
    measure();
    paint(progress.current);
  }, [measure, paint]);
  useLayoutEffect(refresh, [refresh]);

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
      progress.current +=
        (target.current - progress.current) * (1 - Math.exp(-dt / 22));
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
      changePhase(inside || moving ? "scrubbing" : "idle");
      if (moving) frame.current = requestAnimationFrame(update);
      else {
        frame.current = 0;
        lastTime.current = 0;
      }
    },
    [paint, changePhase],
  );

  const wake = useCallback(() => {
    changePhase("scrubbing");
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  }, [tick, changePhase]);

  const input = useCallback(
    (delta, onScene) => {
      auto.current = null;
      commit.current = onScene;
      // Reverse immediately instead of first finishing any queued forward motion.
      if (delta * (target.current - progress.current) < 0)
        target.current = progress.current;
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
        duration: 360 * Math.abs(value - progress.current) + 60,
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
      changePhase("idle");
    },
    [paint, changePhase],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const engaged = useCallback(
    () =>
      !!auto.current ||
      progress.current !== target.current ||
      (progress.current > 0 && progress.current < 1),
    [],
  );
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
