import { useEffect, useRef, useState } from "react";
import {
  getIdlePressure,
  getPressureFontSettings,
  getRipplePressure,
  type IdlePressureMode,
  type PressurePoint,
  type PressureRipple,
} from "@/lib/text-pressure";

const MAX_RIPPLES = 6;

type TextPressureProps = {
  text: string;
  fontFamily?: string;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  radius?: number;
  smoothing?: number;
  idle?: IdlePressureMode;
  idleSpeed?: number;
  clickRipple?: boolean;
};

type AppliedStyle = {
  span: HTMLSpanElement;
  settings: string;
  opacity: string;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function TextPressure({
  text,
  fontFamily = "Roboto Flex",
  textColor = "currentColor",
  strokeColor = "#ff0000",
  strokeWidth = 3,
  className = "",
  minFontSize = 24,
  width = true,
  weight = true,
  italic = false,
  alpha = false,
  flex = true,
  stroke = false,
  radius = 0.5,
  smoothing = 0.5,
  idle = "wave",
  idleSpeed = 1,
  clickRipple = true,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<Array<HTMLSpanElement | null>>([]);
  const wakeRef = useRef<(() => void) | null>(null);
  const visibleRef = useRef(true);
  const ripplesRef = useRef<PressureRipple[]>([]);
  const mouseRef = useRef<PressurePoint>({ x: 0, y: 0 });
  const cursorRef = useRef<PressurePoint & { seen: boolean }>({ x: 0, y: 0, seen: false });
  const [fontSize, setFontSize] = useState(minFontSize);
  const chars = Array.from(text);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      const { width: containerWidth } = container.getBoundingClientRect();
      const nextFontSize = Math.max(
        chars.length ? containerWidth / (chars.length / 2) : minFontSize,
        minFontSize,
      );
      setFontSize(nextFontSize);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [chars.length, minFontSize]);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      spansRef.current.forEach((span) => {
        if (span) {
          span.style.fontVariationSettings = getPressureFontSettings(0.65, { width, weight, italic });
        }
      });
      return;
    }

    const wake = () => wakeRef.current?.();
    const track = (x: number, y: number) => {
      cursor.x = x;
      cursor.y = y;
      cursor.seen = true;
      wake();
    };
    const handleMouseMove = (event: MouseEvent) => track(event.clientX, event.clientY);
    const handleTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) track(touch.clientX, touch.clientY);
    };
    const handleLeave = () => {
      cursor.seen = false;
      wake();
    };
    const handlePress = (event: PointerEvent) => {
      if (!clickRipple) return;
      ripplesRef.current.push({ x: event.clientX, y: event.clientY, start: performance.now() });
      if (ripplesRef.current.length > MAX_RIPPLES) ripplesRef.current.shift();
      wake();
    };

    const bounds = container.getBoundingClientRect();
    mouseRef.current = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
    cursor.x = mouseRef.current.x;
    cursor.y = mouseRef.current.y;

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) wake();
      });
    observer?.observe(container);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });
    window.addEventListener("touchend", handleLeave);
    window.addEventListener("touchcancel", handleLeave);
    window.addEventListener("scroll", wake, { passive: true, capture: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    container.addEventListener("pointerdown", handlePress);

    return () => {
      observer?.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("touchend", handleLeave);
      window.removeEventListener("touchcancel", handleLeave);
      window.removeEventListener("scroll", wake, { capture: true });
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      container.removeEventListener("pointerdown", handlePress);
    };
  }, [clickRipple, idle, idleSpeed, italic, radius, smoothing, textColor, width, weight]);

  useEffect(() => {
    const title = titleRef.current;
    const container = containerRef.current;
    if (!title || !container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animationFrame = 0;
    let lastFrame = 0;
    let clock = 0;
    let engage = idle === "wave" || idle === "pulse" ? 0 : 1;
    const applied: Array<AppliedStyle | undefined> = [];

    const tick = (now: number) => {
      animationFrame = 0;
      const elapsed = lastFrame ? Math.min(now - lastFrame, 64) : 1000 / 60;
      lastFrame = now;
      const mouse = mouseRef.current;
      const cursor = cursorRef.current;
      const lag = 1000 * smoothing * smoothing;
      const follow = lag > 1 ? 1 - Math.exp(-elapsed / lag) : 1;
      mouse.x += (cursor.x - mouse.x) * follow;
      mouse.y += (cursor.y - mouse.y) * follow;

      const bounds = container.getBoundingClientRect();
      const inside = cursor.x >= bounds.left && cursor.x <= bounds.right
        && cursor.y >= bounds.top && cursor.y <= bounds.bottom;
      const present = cursor.seen && inside ? 1 : 0;
      engage += (present - engage) * (1 - Math.exp(-elapsed / 320));
      if (Math.abs(present - engage) < 0.002) engage = present;
      const idling = idle !== "none" && engage < 1;
      if (idling) clock += (elapsed / 1000) * idleSpeed;

      const ripples = ripplesRef.current;
      while (ripples.length && now - ripples[0]!.start > 1300) ripples.shift();

      const titleBounds = title.getBoundingClientRect();
      const maxDistance = Math.max(titleBounds.width * radius, 1);
      const spread = Math.max(radius * 2, 0.2);
      let changed = false;

      spansRef.current.forEach((span, index) => {
        if (!span) return;
        const bounds = span.getBoundingClientRect();
        const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
        let pressure = clamp01(1 - Math.hypot(mouse.x - center.x, mouse.y - center.y) / maxDistance);

        if (idling) {
          const position = (center.x - titleBounds.left) / Math.max(titleBounds.width, 1);
          const resting = getIdlePressure(idle, position, clock, spread);
          pressure = resting + (pressure - resting) * engage;
        }

        if (ripples.length) {
          const swell = getRipplePressure(ripples, center, now, titleBounds.width);
          pressure = 1 - (1 - pressure) * (1 - swell);
        }

        const settings = getPressureFontSettings(pressure, { width, weight, italic });
        const opacity = alpha ? pressure.toFixed(2) : "";
        const previous = applied[index];
        if (!previous || previous.span !== span || previous.settings !== settings || previous.opacity !== opacity) {
          span.style.fontVariationSettings = settings;
          span.style.opacity = opacity;
          applied[index] = { span, settings, opacity };
          changed = true;
        }
      });

      const moving = Math.abs(cursor.x - mouse.x) > 0.1 || Math.abs(cursor.y - mouse.y) > 0.1;
      const animating = moving || idling || engage !== present || ripples.length > 0;
      if (animating || changed) animationFrame = requestAnimationFrame(tick);
      else lastFrame = 0;
    };

    const wake = () => {
      if (!animationFrame && visibleRef.current) animationFrame = requestAnimationFrame(tick);
    };

    wakeRef.current = wake;
    wake();
    return () => {
      cancelAnimationFrame(animationFrame);
      wakeRef.current = null;
    };
  }, [alpha, idle, idleSpeed, italic, radius, smoothing, weight, width]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <h1
        ref={titleRef}
        aria-label={text}
        className={`text-pressure-title m-0 h-full w-full select-none text-brand ${className} ${stroke ? "is-stroke" : ""}`}
        style={{
          fontFamily,
          fontSize,
          fontWeight: 700,
          lineHeight: 1,
          textAlign: "left",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          display: flex ? "flex" : undefined,
          justifyContent: flex ? "space-between" : undefined,
          color: textColor,
          ["--text-pressure-stroke-width" as string]: `${strokeWidth}px`,
          ["--text-pressure-stroke-color" as string]: strokeColor,
        }}
      >
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            ref={(element) => { spansRef.current[index] = element; }}
            data-char={char}
            aria-hidden="true"
            style={{ display: "inline-block" }}
          >
            {char}
          </span>
        ))}
      </h1>
      {stroke && (
        <style>{`
          .text-pressure-title.is-stroke span { position: relative; }
          .text-pressure-title.is-stroke span::after {
            content: attr(data-char);
            position: absolute;
            inset: 0;
            color: transparent;
            z-index: -1;
            -webkit-text-stroke-width: var(--text-pressure-stroke-width);
            -webkit-text-stroke-color: var(--text-pressure-stroke-color);
          }
        `}</style>
      )}
    </div>
  );
}
