import { useEffect, useRef } from 'react';

const DEFAULT_CURSOR_SIZE = 42;
const EASING = 0.18;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function useCustomCursor(enabled = true) {
  const cursorRef = useRef(null);
  const frameIdRef = useRef(null);
  const activeButtonRef = useRef(null);
  const pointerRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentRef = useRef({
    x: pointerRef.current.x,
    y: pointerRef.current.y,
    width: DEFAULT_CURSOR_SIZE,
    height: DEFAULT_CURSOR_SIZE,
    opacity: 0,
    radius: '50%'
  });
  const targetRef = useRef({
    x: pointerRef.current.x,
    y: pointerRef.current.y,
    width: DEFAULT_CURSOR_SIZE,
    height: DEFAULT_CURSOR_SIZE,
    opacity: 0,
    radius: '50%'
  });

  useEffect(() => {
    if (!enabled) return;

    const supportsFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!supportsFinePointer || !cursorRef.current) return;

    const cursor = cursorRef.current;

    const setDefaultTarget = (x, y) => {
      targetRef.current = {
        x,
        y,
        width: DEFAULT_CURSOR_SIZE,
        height: DEFAULT_CURSOR_SIZE,
        opacity: 1,
        radius: '50%'
      };
    };

    const syncActiveButton = () => {
      const button = activeButtonRef.current;
      if (!button) {
        setDefaultTarget(pointerRef.current.x, pointerRef.current.y);
        return;
      }

      const rect = button.getBoundingClientRect();
      const radius = window.getComputedStyle(button).borderRadius || '0px';

      targetRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        opacity: 1,
        radius
      };
    };

    const handlePointerMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };

      const button = event.target && event.target.closest ? event.target.closest('button') : null;
      if (button) {
        activeButtonRef.current = button;
        syncActiveButton();
        return;
      }

      activeButtonRef.current = null;
      setDefaultTarget(pointerRef.current.x, pointerRef.current.y);
    };

    const handlePointerLeave = () => {
      activeButtonRef.current = null;
      targetRef.current.opacity = 0;
    };

    const handleWindowResize = () => {
      if (activeButtonRef.current) {
        syncActiveButton();
      } else {
        setDefaultTarget(pointerRef.current.x, pointerRef.current.y);
      }
    };

    const animate = () => {
      const current = currentRef.current;
      const target = targetRef.current;

      current.x += (target.x - current.x) * EASING;
      current.y += (target.y - current.y) * EASING;
      current.width += (target.width - current.width) * EASING;
      current.height += (target.height - current.height) * EASING;
      current.opacity += (target.opacity - current.opacity) * 0.18;

      current.width = clamp(current.width, 18, 1200);
      current.height = clamp(current.height, 18, 1200);

      cursor.style.left = `${current.x - current.width / 2}px`;
      cursor.style.top = `${current.y - current.height / 2}px`;
      cursor.style.width = `${current.width}px`;
      cursor.style.height = `${current.height}px`;
      cursor.style.opacity = `${current.opacity}`;
      cursor.style.borderRadius = target.radius;

      frameIdRef.current = requestAnimationFrame(animate);
    };

    cursor.style.opacity = '0';
    frameIdRef.current = requestAnimationFrame(animate);

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('scroll', handleWindowResize, { passive: true });
    window.addEventListener('blur', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      document.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('scroll', handleWindowResize);
      window.removeEventListener('blur', handlePointerLeave);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [enabled]);

  return { cursorRef };
}

export default function CustomCursor({ enabled = true }) {
  const { cursorRef } = useCustomCursor(enabled);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}
