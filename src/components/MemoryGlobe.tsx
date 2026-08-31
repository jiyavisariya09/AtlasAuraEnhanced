'use client';

import { useEffect, useRef, useCallback, memo } from 'react';
import type { MemoryPin } from '@/types';

interface MemoryGlobeProps {
  pins: MemoryPin[];
  /** Index of the memory currently being quoted; the globe turns to face it. */
  activeIndex: number;
  onSelect?: (index: number) => void;
  theme: 'dark' | 'light';
  className?: string;
}

const D2R = Math.PI / 180;
const TAU = Math.PI * 2;

type RGB = readonly [number, number, number];

interface Palette {
  additive: boolean;
  body: RGB;
  bodyAlpha: number;
  grat: RGB;
  gratAlpha: number;
  equatorAlpha: number;
  stipple: RGB;
  stippleAlpha: number;
  arc: RGB;
  arcAlpha: number;
  pin: RGB;
  pinCore: RGB;
  ambient: RGB;
  halo: RGB;
  haloAlpha: number;
}

/* Night composites additively so overlapping glows bloom. Day cannot — adding
   light to a white page does nothing — so it draws dark ink normally instead. */
const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: {
    additive: true,
    body: [11, 17, 36], bodyAlpha: 0.62,
    grat: [62, 232, 200], gratAlpha: 0.15, equatorAlpha: 0.34,
    stipple: [232, 237, 247], stippleAlpha: 0.3,
    arc: [139, 127, 245], arcAlpha: 0.36,
    pin: [62, 232, 200], pinCore: [240, 253, 250],
    ambient: [62, 232, 200],
    halo: [110, 160, 235], haloAlpha: 0.16,
  },
  light: {
    additive: false,
    body: [252, 253, 255], bodyAlpha: 0.92,
    grat: [14, 130, 112], gratAlpha: 0.3, equatorAlpha: 0.55,
    stipple: [38, 58, 96], stippleAlpha: 0.4,
    arc: [90, 76, 209], arcAlpha: 0.5,
    pin: [10, 122, 105], pinCore: [255, 255, 255],
    ambient: [14, 130, 112],
    halo: [90, 120, 200], haloAlpha: 0.1,
  },
};

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

const toVec = (lat: number, lng: number): [number, number, number] => {
  const p = lat * D2R;
  const l = lng * D2R;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
};

function rotate(
  v: readonly [number, number, number],
  yaw: number,
  pitch: number,
): [number, number, number] {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = v[0] * cy + v[2] * sy;
  const z1 = -v[0] * sy + v[2] * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return [x1, v[1] * cp - z1 * sp, v[1] * sp + z1 * cp];
}

function slerp(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
): [number, number, number] {
  const d = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const o = Math.acos(d);
  if (o < 1e-6) return [a[0], a[1], a[2]];
  const s = Math.sin(o);
  const k0 = Math.sin((1 - t) * o) / s;
  const k1 = Math.sin(t * o) / s;
  return [a[0] * k0 + b[0] * k1, a[1] * k0 + b[1] * k1, a[2] * k0 + b[2] * k1];
}

/** Deterministic scatter suggesting the wider community of memories. */
function ambientPoints(n: number) {
  let s = 1337;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  return Array.from({ length: n }, () => {
    const lat = ((rnd() + rnd() + rnd()) / 3) * 150 - 68;
    return toVec(lat, rnd() * 360 - 180);
  });
}

/** After a drag, how long the visitor keeps the wheel before the globe resumes
 *  following the quoted memory. Long enough to explore, short enough that the
 *  hero's choreography isn't broken for the rest of the session. */
const HAND_BACK_MS = 9000;

/** Shortest signed angular distance from a to b. */
const angleDelta = (a: number, b: number) => {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
};

function MemoryGlobe({
  pins,
  activeIndex,
  onSelect,
  theme,
  className = '',
}: MemoryGlobeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLSpanElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);

  /* All animation state lives in refs: the render loop must never trigger a
     React re-render, or the page would reconcile 60 times a second. */
  const view = useRef({
    yaw: -25 * D2R,
    pitch: 0.32,
    targetYaw: -25 * D2R,
    targetPitch: 0.32,
    dragging: false,
    userControlled: false,
    releasedAt: 0,
    moved: 0,
    lastX: 0,
    lastY: 0,
    velYaw: 0,
    hovered: -1,
    labelIndex: -2,
    visible: true,
  });

  const pinVecs = useRef<[number, number, number][]>([]);
  const ambient = useRef(ambientPoints(60));
  const themeRef = useRef(theme);
  const pinsRef = useRef(pins);
  const onSelectRef = useRef(onSelect);
  const activeRef = useRef(activeIndex);

  themeRef.current = theme;
  pinsRef.current = pins;
  onSelectRef.current = onSelect;
  activeRef.current = activeIndex;

  useEffect(() => {
    pinVecs.current = pins.map((p) => toVec(p.lat, p.lng));
  }, [pins]);

  /* Aim the camera at the quoted memory. yaw centres the pin's longitude;
     +0.22rad nudges it clear of the text column. The pitch factor is
     deliberately under 1 and clamped: fully centring a 64°N pin like Iceland
     would tip the globe into a flat polar view. 0.85/0.78rad keeps every pin
     within ~20° of dead centre. */
  const retarget = useCallback(() => {
    const p = pinsRef.current[activeRef.current];
    if (!p) return;
    const v = view.current;
    v.targetYaw = -p.lng * D2R + 0.22;
    v.targetPitch = Math.max(-0.78, Math.min(0.78, p.lat * D2R * 0.85));
  }, []);

  /* Follow the quoted memory — but never yank the globe out of the visitor's
     hands mid-drag. The frame loop hands control back after HAND_BACK_MS. */
  useEffect(() => {
    if (view.current.userControlled) return;
    retarget();
  }, [activeIndex, pins, retarget]);

  const pickPin = useCallback((mx: number, my: number, w: number, h: number) => {
    const v = view.current;
    const R = Math.min(w, h) * 0.52;
    const cx = w * 0.62;
    const cy = h * 0.5;
    let best = -1;
    let bestD = 26;
    pinVecs.current.forEach((pv, i) => {
      const r = rotate(pv, v.yaw, v.pitch);
      if (r[2] <= 0.05) return;
      const d = Math.hypot(cx + r[0] * R - mx, cy - r[1] * R - my);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        view.current.visible = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    io.observe(wrap);

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const v = view.current;

      if (!v.visible || document.hidden) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const pal = PALETTES[themeRef.current];
      const list = pinsRef.current;
      const activeIdx = activeRef.current;

      // ── motion ───────────────────────────────────────────────────────
      if (!v.dragging) {
        if (v.userControlled) {
          /* Hand the wheel back once they've stopped, so the hero's
             quote-to-globe choreography resumes instead of being dead for the
             rest of the session. */
          if (now - v.releasedAt > HAND_BACK_MS) {
            v.userControlled = false;
            retarget();
          } else {
            v.velYaw *= Math.pow(0.9, dt / 16);
            v.yaw += v.velYaw * dt;
            if (!reduced && v.hovered < 0) v.yaw += 0.00005 * dt;
          }
        } else {
          const k = 1 - Math.exp(-dt / 260);
          v.yaw += angleDelta(v.yaw, v.targetYaw) * k;
          v.pitch += (v.targetPitch - v.pitch) * k;
          if (!reduced && v.hovered < 0) v.yaw += 0.00004 * dt;
        }
      }

      // ── geometry ─────────────────────────────────────────────────────
      const R = Math.min(w, h) * 0.52;
      const cx = w * 0.62;
      const cy = h * 0.5;
      const proj = (p: readonly [number, number, number]) =>
        [cx + p[0] * R, cy - p[1] * R, p[2]] as const;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      // atmosphere
      const halo = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.32);
      halo.addColorStop(0, rgba(pal.halo, pal.haloAlpha));
      halo.addColorStop(0.45, rgba(pal.halo, pal.haloAlpha * 0.4));
      halo.addColorStop(1, rgba(pal.halo, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.32, 0, TAU);
      ctx.fill();

      // sphere body
      const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      body.addColorStop(0, rgba(pal.body, pal.bodyAlpha));
      body.addColorStop(1, rgba(pal.body, pal.bodyAlpha * (pal.additive ? 0.55 : 1)));
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.fill();

      // limb
      ctx.strokeStyle = rgba(pal.grat, pal.gratAlpha * 2.1);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.stroke();

      if (pal.additive) ctx.globalCompositeOperation = 'lighter';

      // ── graticule: the atlas's own coordinate grid ───────────────────
      const drawRing = (pts: [number, number, number][], alpha: number) => {
        ctx.lineWidth = 1;
        for (let i = 0; i < pts.length - 1; i++) {
          const a = proj(pts[i]);
          const b = proj(pts[i + 1]);
          const z = (a[2] + b[2]) / 2;
          ctx.strokeStyle = rgba(pal.grat, z > 0 ? alpha * (0.22 + 0.78 * z) : alpha * 0.26);
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.stroke();
        }
      };

      for (let lat = -60; lat <= 60; lat += 30) {
        const pts: [number, number, number][] = [];
        for (let lng = -180; lng <= 180; lng += 4) pts.push(rotate(toVec(lat, lng), v.yaw, v.pitch));
        drawRing(pts, lat === 0 ? pal.equatorAlpha : pal.gratAlpha);
      }
      // Meridians run to ±88° so they converge into a tidy star at the pole,
      // which becomes visible once the globe tilts to face a Nordic pin.
      for (let lng = -180; lng < 180; lng += 30) {
        const pts: [number, number, number][] = [];
        for (let lat = -88; lat <= 88; lat += 4) pts.push(rotate(toVec(lat, lng), v.yaw, v.pitch));
        drawRing(pts, pal.gratAlpha * 0.92);
      }

      // ── stipple: plotted texture, density scaled to the drawn area ───
      const count = Math.round(Math.max(1400, Math.min(5200, R * R * 0.028)));
      const GA = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const rr = Math.sqrt(Math.max(0, 1 - y * y));
        const th = GA * i;
        const p = rotate([Math.cos(th) * rr, y, Math.sin(th) * rr], v.yaw, v.pitch);
        if (p[2] <= 0) continue;
        const s = proj(p);
        ctx.fillStyle = rgba(pal.stipple, pal.stippleAlpha * (0.28 + 0.72 * p[2]));
        ctx.fillRect(s[0] - 0.6, s[1] - 0.6, 1.2, 1.2);
      }

      // ambient community memories
      for (const a of ambient.current) {
        const p = rotate(a, v.yaw, v.pitch);
        if (p[2] <= 0.04) continue;
        const s = proj(p);
        const f = 0.4 + 0.6 * p[2];
        ctx.fillStyle = rgba(pal.ambient, 0.5 * f);
        ctx.beginPath();
        ctx.arc(s[0], s[1], 1.5 * f, 0, TAU);
        ctx.fill();
      }

      // ── great-circle arcs, in the order the memories were made ───────
      ctx.lineWidth = 1.15;
      for (let i = 0; i < pinVecs.current.length - 1; i++) {
        const A = pinVecs.current[i];
        const B = pinVecs.current[i + 1];
        let prev: readonly [number, number, number] | null = null;
        for (let s = 0; s <= 64; s++) {
          const t = s / 64;
          const m = slerp(A, B, t);
          const lift = 1 + 0.13 * Math.sin(Math.PI * t);
          const p = rotate([m[0] * lift, m[1] * lift, m[2] * lift], v.yaw, v.pitch);
          const sp = proj(p);
          if (prev && p[2] > 0 && prev[2] > 0) {
            ctx.strokeStyle = rgba(
              pal.arc,
              pal.arcAlpha * p[2] * Math.pow(Math.sin(Math.PI * t), 0.35),
            );
            ctx.beginPath();
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(sp[0], sp[1]);
            ctx.stroke();
          }
          prev = sp;
        }
      }

      // ── the six memories ─────────────────────────────────────────────
      let labelTarget = -1;
      let labelPos: readonly [number, number, number] | null = null;

      pinVecs.current.forEach((pv, i) => {
        const p = rotate(pv, v.yaw, v.pitch);
        if (p[2] <= 0.02) return;
        const s = proj(p);
        const f = 0.5 + 0.5 * p[2];
        const isActive = i === activeIdx;
        const isHover = i === v.hovered;
        const emphasis = isActive || isHover ? 1 : 0.55;

        const g = ctx.createRadialGradient(s[0], s[1], 0, s[0], s[1], 22 * f);
        g.addColorStop(0, rgba(pal.pin, 0.5 * emphasis));
        g.addColorStop(1, rgba(pal.pin, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s[0], s[1], 22 * f, 0, TAU);
        ctx.fill();

        if (isActive) {
          const t = (now % 2800) / 2800;
          ctx.strokeStyle = rgba(pal.pin, 0.5 * (1 - t));
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(s[0], s[1], 4 * f + t * 26 * f, 0, TAU);
          ctx.stroke();
        }

        ctx.fillStyle = rgba(pal.pinCore, isActive || isHover ? 1 : 0.82);
        ctx.beginPath();
        ctx.arc(s[0], s[1], (isActive ? 3.4 : 2.6) * f, 0, TAU);
        ctx.fill();

        if (isHover || (isActive && v.hovered < 0)) {
          labelTarget = i;
          labelPos = s;
        }
      });

      // ── label: real HTML so it gets real type, positioned imperatively
      const label = labelRef.current;
      if (label) {
        if (labelTarget >= 0 && labelPos) {
          const pin = list[labelTarget];
          if (v.labelIndex !== labelTarget && pin) {
            v.labelIndex = labelTarget;
            const ns = pin.lat >= 0 ? 'N' : 'S';
            const ew = pin.lng >= 0 ? 'E' : 'W';
            /* textContent, not innerHTML: country/note/author are
               traveller-authored records, so building markup from them would be
               an injection sink the moment pins come from the database. */
            if (countryRef.current) countryRef.current.textContent = pin.country.toUpperCase();
            if (coordRef.current) {
              coordRef.current.textContent =
                `${Math.abs(pin.lat).toFixed(2)}°${ns} ${Math.abs(pin.lng).toFixed(2)}°${ew}`;
            }
          }
          label.style.opacity = '1';
          const lp = labelPos as readonly [number, number, number];
          /* Pins near the right limb would push the label off-frame, so it
             flips to the pin's left once there isn't room. */
          const lw = label.offsetWidth || 150;
          const flip = lp[0] + 16 + lw > w - 8;
          const lx = flip ? lp[0] - 16 - lw : lp[0] + 16;
          label.style.transform = `translate3d(${Math.max(8, lx)}px, ${Math.max(8, lp[1] - 30)}px, 0)`;
        } else {
          label.style.opacity = '0';
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    // ── pointer interaction ────────────────────────────────────────────
    const onDown = (e: PointerEvent) => {
      const v = view.current;
      v.dragging = true;
      v.userControlled = true;
      v.moved = 0;
      v.lastX = e.clientX;
      v.lastY = e.clientY;
      v.velYaw = 0;
      canvas.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      const v = view.current;
      const rect = canvas.getBoundingClientRect();
      if (v.dragging) {
        const dx = e.clientX - v.lastX;
        const dy = e.clientY - v.lastY;
        v.lastX = e.clientX;
        v.lastY = e.clientY;
        v.moved += Math.abs(dx) + Math.abs(dy);
        v.yaw += dx * 0.0055;
        v.pitch = Math.max(-1.05, Math.min(1.05, v.pitch + dy * 0.0045));
        v.velYaw = dx * 0.0055 * 0.06;
        v.targetYaw = v.yaw;
        v.targetPitch = v.pitch;
      } else {
        const hit = pickPin(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
        if (hit !== v.hovered) {
          v.hovered = hit;
          canvas.style.cursor = hit >= 0 ? 'pointer' : 'grab';
        }
      }
    };

    const onUp = (e: PointerEvent) => {
      const v = view.current;
      v.dragging = false;
      v.releasedAt = performance.now();
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };

    const onLeave = () => {
      view.current.hovered = -1;
      canvas.style.cursor = 'grab';
    };

    const onClick = () => {
      const v = view.current;
      /* A drag ends in a click event too — only treat it as a pick if the
         pointer barely travelled. */
      if (v.moved > 6) return;
      const hit = v.hovered;
      if (hit < 0) return;
      // An explicit pick is a request to re-sync, so give the camera back now.
      v.userControlled = false;
      onSelectRef.current?.(hit);
      retarget();
    };

    canvas.style.cursor = 'grab';
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
    };
    /* Deliberately depends on nothing that changes per memory. The active pin
       is read from a ref inside the loop, so cycling quotes never tears down
       the canvas, observers, or listeners. Both deps are stable. */
  }, [pickPin, retarget]);

  /* Keyboard/screen-reader picks go through the same re-sync path as a click. */
  const pick = useCallback(
    (i: number) => {
      view.current.userControlled = false;
      onSelect?.(i);
      retarget();
    },
    [onSelect, retarget],
  );

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full touch-none" aria-hidden="true" />

      <div
        ref={labelRef}
        aria-hidden="true"
        className="t-data pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full border border-border bg-[hsl(var(--popover))]/85 px-2.5 py-1 text-[11px] backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: 0 }}
      >
        <span ref={countryRef} className="text-aurora" />
        <span className="opacity-45"> / </span>
        <span ref={coordRef} />
      </div>

      {/* The canvas is decorative; these buttons are the real, reachable
          control surface for keyboard and screen-reader users. */}
      <ul className="sr-only">
        {pins.map((p, i) => (
          <li key={p.id}>
            <button type="button" onClick={() => pick(i)}>
              {`${p.country}, ${p.lat.toFixed(2)}, ${p.lng.toFixed(2)}: ${p.note}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Memoised: the hero re-renders as quotes cycle, and none of those renders
   should reach the canvas. */
export default memo(MemoryGlobe);
