import { useEffect, useRef, type ReactNode } from "react";

/**
 * Parallax forest background wrapper.
 * Renders layered tree silhouettes behind children content.
 */
export default function ParallaxForest({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;
    const isMobile = window.innerWidth < 768;
    const speeds = isMobile
      ? [0.02, 0.04, 0.07, 0.11, 0.16]
      : [0.04, 0.08, 0.14, 0.22, 0.32];

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) { ticking = false; return; }
        const rect = section.getBoundingClientRect();
        const viewH = window.innerHeight;
        const offset = -(rect.top / viewH);

        layersRef.current.forEach((layer, i) => {
          if (!layer) return;
          const y = offset * speeds[i] * viewH;
          layer.style.transform = `translate3d(0, ${y}px, 0)`;
        });
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setRef = (i: number) => (el: HTMLDivElement | null) => { layersRef.current[i] = el; };

  return (
    <div ref={sectionRef} className="relative overflow-hidden bg-forest-900">
      {/* ── Parallax layers (behind content) ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020605] from-0% via-[#020605] via-25% via-[#071410] via-55% to-[#0f2818]" />

        {/* Stars */}
        <Stars />

        {/* Aurora Borealis */}
        <Aurora />

        <Fireflies />

        {/* Mountains */}
        <div ref={setRef(0)} className="absolute inset-x-0 bottom-0 will-change-transform">
          <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" className="block w-full h-[150vh] md:h-[45vh]">
            <path d="M0,400 L0,280 Q180,140 360,220 Q540,100 720,200 Q900,80 1080,180 Q1260,120 1440,240 L1440,400Z" fill="#11291a" />
          </svg>
        </div>

        {/* Back trees */}
        <div ref={setRef(1)} className="absolute inset-x-0 bottom-0 will-change-transform">
          <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" className="block w-full h-[190vh] md:h-[55vh]">
            <g fill="#152e1d">{backTrees.map((t, i) => <Tree key={i} {...t} />)}</g>
            <rect x="0" y="560" width="1440" height="40" fill="#152e1d" />
          </svg>
        </div>

        {/* Mist */}
        <div ref={setRef(2)} className="absolute inset-x-0 bottom-[30%] h-40 will-change-transform">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-3xl" style={{ animation: "mistDrift 10s ease-in-out infinite alternate" }} />
        </div>

        {/* Mid trees */}
        <div ref={setRef(3)} className="absolute inset-x-0 bottom-0 will-change-transform">
          <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" className="block w-full h-[220vh] md:h-[62vh]">
            <g fill="#1c3b25">{midTrees.map((t, i) => <Tree key={i} {...t} />)}</g>
            <rect x="0" y="560" width="1440" height="40" fill="#1c3b25" />
          </svg>
        </div>

        {/* Front trees */}
        <div ref={setRef(4)} className="absolute inset-x-0 bottom-0 will-change-transform">
          <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" className="block w-full h-[260vh] md:h-[72vh]">
            <g fill="#264d2f">{frontTrees.map((t, i) => <Tree key={i} {...t} />)}</g>
            <rect x="0" y="560" width="1440" height="40" fill="#264d2f" />
          </svg>
        </div>
      </div>

      {/* ── Content (above forest) ── */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/* ─── Stars ─── */

const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  left: `${(i * 31 + 7) % 100}%`,
  top: `${(i * 17 + 3) % 50}%`,
  size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
  opacity: i % 4 === 0 ? 0.9 : i % 3 === 0 ? 0.7 : 0.4,
  delay: `${(i * 0.3) % 6}s`,
  duration: `${2 + (i % 5)}s`,
}));

function Stars() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            width: s.size, height: s.size,
            left: s.left, top: s.top,
            opacity: s.opacity,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Fireflies ─── */

/* ─── Aurora Borealis ─── */

function Aurora() {
  return (
    <div className="absolute inset-x-0 top-0 h-[45%] overflow-hidden">
      {/* Base glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(180deg, transparent 0%, #1a5c3a15 30%, transparent 100%)",
        }}
      />
      {/* Band 1 — green */}
      <div
        className="absolute -left-[25%] -right-[25%] top-[15%] h-[60%]"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 30% 40%, var(--color-aurora-green) 0%, transparent 70%)",
          animation: "auroraDrift1 6s ease-in-out infinite alternate",
        }}
      />
      {/* Band 2 — teal */}
      <div
        className="absolute -left-[25%] -right-[25%] top-[18%] h-[55%]"
        style={{
          background: "radial-gradient(ellipse 70% 45% at 65% 35%, var(--color-aurora-teal) 0%, transparent 70%)",
          animation: "auroraDrift2 5s ease-in-out infinite alternate",
        }}
      />
      {/* Band 3 — purple */}
      <div
        className="absolute -left-[25%] -right-[25%] top-[12%] h-[50%]"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 30%, var(--color-aurora-purple) 0%, transparent 70%)",
          animation: "auroraDrift3 7s ease-in-out infinite alternate",
        }}
      />
      {/* Bright streak */}
      <div
        className="absolute -left-[25%] -right-[25%] top-[25%] h-[30%] blur-xl"
        style={{
          background: "radial-gradient(ellipse 60% 30% at 45% 50%, var(--color-aurora-bright) 0%, transparent 60%)",
          animation: "auroraDrift1 4s ease-in-out infinite alternate-reverse",
        }}
      />
    </div>
  );
}

/* ─── Fireflies ─── */

const fireflies = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 37 + 13) % 90}%`,
  top: `${10 + (i * 53 + 7) % 55}%`,
  size: 2 + (i % 3),
  delay: `${(i * 0.7) % 5}s`,
  duration: `${3 + (i % 4)}s`,
}));

function Fireflies() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full bg-gold/50 animate-pulse"
          style={{
            width: f.size, height: f.size,
            left: f.left, top: f.top,
            animationDelay: f.delay, animationDuration: f.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Tree silhouette (tall conifer) ─── */

function Tree({ x, h, w }: Readonly<{ x: number; h: number; w: number }>) {
  const base = 600;
  const trunkH = h * 0.1;
  const trunkW = w * 0.13;
  const tiers = 5;
  const crownH = h * 0.9;

  return (
    <g>
      <rect x={x - trunkW / 2} y={base - trunkH} width={trunkW} height={trunkH} />
      {Array.from({ length: tiers }, (_, i) => {
        const tierH = crownH / tiers;
        const spread = 1 - i * 0.15; // top tiers narrower
        const tierW = w * spread;
        const overlap = tierH * 0.35; // tiers overlap each other more
        const y = base - trunkH - tierH * (i + 1);
        return (
          <polygon
            key={x * tiers + i}
            points={`${x},${y} ${x - tierW / 2},${y + tierH + overlap} ${x + tierW / 2},${y + tierH + overlap}`}
          />
        );
      })}
    </g>
  );
}

/* ─── Tree data — dense forest ─── */

const backTrees = [
  { x: 40, h: 220, w: 42 }, { x: 110, h: 330, w: 58 }, { x: 200, h: 260, w: 46 },
  { x: 290, h: 350, w: 60 }, { x: 380, h: 240, w: 44 }, { x: 470, h: 310, w: 55 },
  { x: 560, h: 370, w: 62 }, { x: 650, h: 250, w: 45 }, { x: 740, h: 340, w: 58 },
  { x: 830, h: 230, w: 43 }, { x: 920, h: 360, w: 61 }, { x: 1010, h: 270, w: 48 },
  { x: 1100, h: 320, w: 56 }, { x: 1190, h: 240, w: 44 }, { x: 1280, h: 345, w: 59 },
  { x: 1370, h: 260, w: 47 },
];

const midTrees = [
  { x: 20, h: 300, w: 55 }, { x: 110, h: 420, w: 72 }, { x: 210, h: 340, w: 60 },
  { x: 310, h: 450, w: 76 }, { x: 400, h: 310, w: 56 }, { x: 500, h: 430, w: 74 },
  { x: 590, h: 360, w: 62 }, { x: 690, h: 280, w: 52 }, { x: 780, h: 440, w: 75 },
  { x: 870, h: 320, w: 58 }, { x: 960, h: 400, w: 70 }, { x: 1060, h: 290, w: 54 },
  { x: 1150, h: 435, w: 74 }, { x: 1250, h: 330, w: 59 }, { x: 1350, h: 410, w: 71 },
  { x: 1430, h: 300, w: 55 },
];

const frontTrees = [
  { x: 60, h: 420, w: 78 }, { x: 130, h: 550, w: 96 }, { x: 200, h: 460, w: 84 },
  { x: 380, h: 570, w: 98 }, { x: 460, h: 410, w: 76 }, { x: 530, h: 540, w: 94 },
  { x: 700, h: 440, w: 80 }, { x: 870, h: 560, w: 97 }, { x: 940, h: 400, w: 75 },
  { x: 1030, h: 530, w: 92 }, { x: 1200, h: 450, w: 82 }, { x: 1290, h: 555, w: 96 },
  { x: 1370, h: 430, w: 79 },
];
