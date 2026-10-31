import { useEffect, useRef, type ReactNode } from "react";

/**
 * A night descent behind the page: the scene stays pinned while the content scrolls
 * over it, and the scroll drives a camera from the stars, down through the forest,
 * to the lodge on the lake. Everything moves by transform and opacity only, so it
 * holds up on phones; the art is drawn once and never repainted.
 */

/* ─── Camera: each layer's travel over the descent, in % of its own height ─── */

interface Motion {
  y: [number, number];
  scale?: [number, number];
  opacity?: [number, number];
  at?: [number, number]; // the part of the descent this layer moves in
  pointer: number; // % it shifts with the mouse
}

const MOTION: Record<string, Motion> = {
  stars: { y: [0, -18], opacity: [1, 0.7], pointer: 0.15 },
  moon: { y: [0, -9], pointer: 0.2 },
  aurora: { y: [0, -12], opacity: [1, 0.6], pointer: 0.25 },
  farPeaks: { y: [46, 0], pointer: 0.4 },
  nearPeaks: { y: [58, 0], pointer: 0.6 },
  lowMist: { y: [76, 0], opacity: [0.3, 1], pointer: 0.8 },
  backTrees: { y: [72, 0], pointer: 0.9 },
  midTrees: { y: [88, 0], pointer: 1.2 },
  lodge: { y: [96, 0], pointer: 1.3 },
  lake: { y: [112, 0], pointer: 1.6 },
  fireflies: { y: [20, 0], opacity: [0, 1], at: [0.6, 0.92], pointer: 2 },
  passingTrees: { y: [120, -190], scale: [1, 1.35], at: [0.1, 0.8], pointer: 3 },
  boughs: { y: [-105, 0], at: [0.66, 1], pointer: 3.5 },
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const mix = ([a, b]: [number, number], t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

export default function ParallaxForest({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const layers = [...stage.querySelectorAll<HTMLElement>("[data-layer]")].map((el) => ({
      el,
      motion: MOTION[el.dataset.layer ?? ""],
    }));

    const draw = (progress: number, px: number, py: number) => {
      for (const { el, motion } of layers) {
        const [from, to] = motion.at ?? [0, 1];
        const t = smooth(clamp((progress - from) / (to - from)));
        const x = px * motion.pointer;
        const y = mix(motion.y, t) + py * motion.pointer * 0.5;
        const scale = motion.scale ? mix(motion.scale, t) : 1;
        el.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, 0) scale(${scale.toFixed(3)})`;
        if (motion.opacity) el.style.opacity = mix(motion.opacity, t).toFixed(3);
      }
    };

    // With reduced motion: the finished scene, standing still.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(1, 0, 0);
      return;
    }

    let frame = 0;
    let live = false;
    let goal = 0, now = 0;
    let goalX = 0, goalY = 0, nowX = 0, nowY = 0;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      goal = clamp(-rect.top / Math.max(1, rect.height - stage.offsetHeight));
    };

    const tick = () => {
      now += (goal - now) * 0.14;
      nowX += (goalX - nowX) * 0.08;
      nowY += (goalY - nowY) * 0.08;
      draw(now, nowX, nowY);
      const settled = Math.abs(goal - now) < 0.0005
        && Math.abs(goalX - nowX) < 0.005 && Math.abs(goalY - nowY) < 0.005;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };

    const onScroll = () => { measure(); wake(); };
    const onPointer = (e: PointerEvent) => {
      goalX = (e.clientX / window.innerWidth - 0.5) * 2;
      goalY = (e.clientY / window.innerHeight - 0.5) * 2;
      wake();
    };
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    // Only work while the scene is on screen, and pause its drifting when it isn't.
    const watcher = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === live) return;
      live = entry.isIntersecting;
      root.toggleAttribute("data-live", live);
      if (live) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });
        onScroll();
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        window.removeEventListener("pointermove", onPointer);
      }
    });
    watcher.observe(root);

    measure();
    now = goal;
    draw(now, 0, 0);

    return () => {
      watcher.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div ref={rootRef} className="night-scene relative bg-[#020910]">
      <div ref={stageRef} className="night-stage sticky top-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 night-sky" />
        <Art layer="stars"><Sky /></Art>
        <div data-layer="aurora" className="absolute inset-x-0 top-0 h-[72%] will-change-transform"><Aurora /></div>
        <ShootingStars />
        <Art layer="moon"><Moon /></Art>
        <Art layer="farPeaks"><path d={farPeaks} fill="url(#peakFar)" /></Art>
        <Art layer="nearPeaks"><path d={nearPeaks} fill="url(#peakNear)" /></Art>
        <div data-layer="lowMist" className="absolute inset-0 will-change-transform"><Mist /></div>
        <Art layer="backTrees"><path d={backTrees} fill="#0d2a2a" /></Art>
        <Art layer="midTrees"><path d={midTrees} fill="#08201c" /></Art>
        <Art layer="lodge"><Lodge /></Art>
        <Art layer="lake"><Lake /></Art>
        <div data-layer="fireflies" className="absolute inset-0 will-change-transform"><Fireflies /></div>
        <Art layer="passingTrees" anchor="xMidYMid"><path d={passingTrees} fill="#020b09" /></Art>
        <div data-layer="boughs" className="absolute inset-0 will-change-transform"><Boughs /></div>
        <div className="absolute inset-0 night-vignette" />
        <Defs />
      </div>

      {/* ── Content (scrolls over the scene) ── */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* One full-stage drawing. Key art stays in the middle so a phone's narrow crop keeps it. */
function Art({ layer, anchor = "xMidYMax", children }: Readonly<{ layer: string; anchor?: string; children: ReactNode }>) {
  return (
    <div data-layer={layer} className="absolute inset-y-0 -inset-x-[5%] will-change-transform">
      <svg viewBox="0 0 1600 1000" preserveAspectRatio={`${anchor} slice`} className="block w-full h-full">
        {children}
      </svg>
    </div>
  );
}

/* ─── Drawing the forest: seeded, so it's the same every visit ─── */

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function conifer(rnd: () => number, x: number, base: number, h: number, w: number) {
  const top = base - h;
  const tiers = Math.min(10, 5 + Math.floor(h / 60));
  const side = (dir: number) => {
    const pts: string[] = [];
    for (let i = 1; i <= tiers; i++) {
      const y = top + (h * 0.94 * i) / tiers;
      const reach = (w / 2) * (i / tiers) ** 0.85 * (0.82 + rnd() * 0.36);
      pts.push(`${Math.round(x + dir * reach)} ${Math.round(y)}`);
      pts.push(`${Math.round(x + dir * reach * 0.52)} ${Math.round(y - (h / tiers) * 0.1)}`);
    }
    return dir > 0 ? pts.reverse() : pts;
  };
  return `M${x} ${Math.round(top)}L${side(-1).join("L")}L${side(1).join("L")}Z`;
}

function forest(seed: number, base: number, min: number, max: number, gap: number, clearing?: [number, number]) {
  const rnd = seeded(seed);
  let d = `M-60 ${base}L1660 ${base}L1660 1000L-60 1000Z`;
  for (let x = -40; x < 1640; x += gap * (0.6 + rnd() * 0.8)) {
    const inside = clearing && x > clearing[0] && x < clearing[1];
    if (inside && min > 300) continue; // the camera's path through the big trees
    const h = inside ? min * 0.3 : min + rnd() * (max - min);
    d += conifer(rnd, Math.round(x), base + rnd() * 10, h, h * (0.34 + rnd() * 0.12));
  }
  return d;
}

function ridge(seed: number, base: number, amp: number) {
  const rnd = seeded(seed);
  const [a, b, c] = [rnd() * 6, rnd() * 6, rnd() * 6];
  let d = "M-60 1000";
  for (let x = -60; x <= 1660; x += 16) {
    const y = base
      - Math.sin(x / 260 + a) * amp
      - Math.sin(x / 110 + b) * amp * 0.42
      - Math.sin(x / 43 + c) * amp * 0.12
      - rnd() * amp * 0.05;
    d += `L${x} ${Math.round(y)}`;
  }
  return `${d}L1660 1000Z`;
}

function bough(seed: number, flip: boolean) {
  const rnd = seeded(seed);
  let d = "";
  for (let b = 0; b < 3; b++) {
    const y0 = 8 + b * 42, len = 330 - b * 70, droop = 70 + b * 22;
    d += `M0 ${y0}Q${len * 0.55} ${y0 + droop * 0.1} ${len} ${y0 + droop}`;
    for (let s = 0.08; s < 1; s += 0.028) {
      const q = 1 - s;
      const x = 2 * q * s * len * 0.55 + s * s * len;
      const y = q * q * y0 + 2 * q * s * (y0 + droop * 0.1) + s * s * (y0 + droop);
      const reach = (58 - 34 * s) * (0.75 + rnd() * 0.5);
      d += `M${x.toFixed(0)} ${y.toFixed(0)}l${(reach * 0.52).toFixed(0)} ${(reach * 0.72).toFixed(0)}`;
      d += `M${x.toFixed(0)} ${y.toFixed(0)}l${(reach * 0.62).toFixed(0)} ${(-reach * 0.4).toFixed(0)}`;
    }
  }
  return { d, flip };
}

const farPeaks = ridge(11, 470, 70);
const nearPeaks = ridge(29, 575, 48);
const backTrees = forest(3, 738, 110, 190, 26);
const midTrees = forest(7, 752, 170, 275, 44, [575, 835]);
const passingTrees = forest(13, 1010, 640, 960, 165, [640, 960]);
const boughLeft = bough(5, false);
const boughRight = bough(9, true);

/* ─── Sky ─── */

const skyDots = (() => {
  const rnd = seeded(21);
  return Array.from({ length: 330 }, (_, i) => ({
    x: Math.round(rnd() * 1600),
    y: Math.round(rnd() * rnd() * 640),
    r: i % 13 === 0 ? 2.1 : i % 4 === 0 ? 1.5 : 1,
    o: 0.35 + rnd() * 0.65,
  }));
})();

function Sky() {
  return (
    <>
      <ellipse cx="800" cy="210" rx="760" ry="120" fill="url(#milkyWay)" transform="rotate(-24 800 210)" />
      {[0, 1, 2].map((group) => (
        <g key={group} fill="#f4f7ff" className={group ? `twinkle twinkle-${group}` : undefined}>
          {skyDots.filter((_, i) => i % 3 === group).map((s) => (
            <circle key={`${s.x}-${s.y}`} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />
          ))}
        </g>
      ))}
    </>
  );
}

function Moon() {
  return (
    <>
      <circle cx="905" cy="285" r="170" fill="url(#moonHalo)" />
      <circle cx="905" cy="285" r="46" fill="#fbf7e6" />
      <circle cx="890" cy="274" r="8" fill="#e4dec6" opacity="0.8" />
      <circle cx="918" cy="298" r="12" fill="#e4dec6" opacity="0.65" />
      <circle cx="914" cy="266" r="5" fill="#e4dec6" opacity="0.7" />
    </>
  );
}

function Aurora() {
  return (
    <>
      <div className="aurora-band aurora-green" />
      <div className="aurora-band aurora-teal" />
      <div className="aurora-band aurora-violet" />
      <div className="aurora-rays" />
      <div className="aurora-rays aurora-rays-slow" />
    </>
  );
}

function ShootingStars() {
  return (
    <>
      <div className="shooting-star" style={{ top: "12%", left: "62%" }} />
      <div className="shooting-star shooting-star-late" style={{ top: "24%", left: "84%" }} />
    </>
  );
}

function Mist() {
  return (
    <>
      <div className="mist-band" style={{ top: "60%" }} />
      <div className="mist-band mist-band-slow" style={{ top: "67%" }} />
    </>
  );
}

/* ─── The lodge, the falls and the lake ─── */

function Lodge() {
  return (
    <>
      {/* Waterfall */}
      <path d="M500 748L516 700L538 668L566 650L580 612L612 596L650 604L690 640L720 748Z" fill="#18242a" />
      <path d="M540 700L566 690M640 640L672 662M530 728L560 720M650 690L690 704" stroke="#2c3d45" strokeWidth="4" strokeLinecap="round" />
      <path d="M602 606C598 650 596 700 586 744L640 744C632 700 626 650 624 606Z" fill="url(#falls)" />
      <g stroke="#f2fbff" strokeWidth="2" strokeLinecap="round" fill="none" className="twinkle twinkle-2">
        <path d="M606 618C604 660 600 700 594 740M618 620C620 660 624 700 630 740" strokeDasharray="24 14" />
      </g>
      <g stroke="#f2fbff" strokeWidth="2" strokeLinecap="round" fill="none" className="twinkle">
        <path d="M612 612C612 660 611 700 610 742M601 660C599 690 597 716 592 738" strokeDasharray="16 20" />
      </g>
      <ellipse cx="612" cy="744" rx="86" ry="24" fill="url(#puff)" />
      <ellipse cx="612" cy="716" rx="52" ry="30" fill="url(#puff)" opacity="0.5" />

      {/* Window light on the clearing */}
      <circle cx="745" cy="690" r="190" fill="url(#lodgeGlow)" />

      {/* Chimney smoke */}
      <g fill="url(#puff)">
        <circle cx="792" cy="584" r="16" className="smoke" />
        <circle cx="792" cy="584" r="20" className="smoke smoke-2" />
        <circle cx="792" cy="584" r="24" className="smoke smoke-3" />
      </g>

      {/* The cabin */}
      <path d="M782 640V594H802V640Z" fill="#1d1712" />
      <path d="M654 742V668H840V742Z" fill="#3a2517" />
      <path d="M654 684H840M654 700H840M654 716H840M654 732H840" stroke="#21140c" strokeWidth="2.5" />
      <path d="M630 674L747 590L864 674L846 680L747 610L648 680Z" fill="#17322a" />
      <path d="M672 672L747 616L822 672Z" fill="#3a2517" />
      <path d="M714 668L747 640L780 668Z" fill="url(#windowLight)" />
      <path d="M747 640V668M730 654V668M764 654V668" stroke="#3a2517" strokeWidth="2.5" />
      <g fill="url(#windowLight)">
        <rect x="678" y="686" width="36" height="30" rx="1.5" />
        <rect x="726" y="686" width="42" height="42" rx="1.5" />
        <rect x="782" y="686" width="36" height="30" rx="1.5" />
      </g>
      <path d="M696 686V716M678 701H714M747 686V728M726 707H768M800 686V716M782 701H818" stroke="#3a2517" strokeWidth="2.5" />
    </>
  );
}

function Lake() {
  return (
    <>
      <path d="M-60 740Q400 730 800 738T1660 734V1000H-60Z" fill="url(#water)" />

      {/* The forest in the water */}
      <g clipPath="url(#lakeOnly)">
        <path d={backTrees} fill="#03141a" opacity="0.5" transform="translate(0 1478) scale(1 -1)" />
        <path d={midTrees} fill="#020f13" opacity="0.65" transform="translate(0 1484) scale(1 -1)" />
      </g>

      {/* The moon and the cabin in the water */}
      <g fill="#f6f1dc" className="twinkle twinkle-1">
        <rect x="878" y="760" width="58" height="3" rx="1.5" opacity="0.65" />
        <rect x="858" y="794" width="96" height="4" rx="2" opacity="0.5" />
        <rect x="844" y="842" width="126" height="4" rx="2" opacity="0.4" />
        <rect x="826" y="902" width="164" height="5" rx="2.5" opacity="0.28" />
      </g>
      <g fill="#f6f1dc" className="twinkle twinkle-2">
        <rect x="866" y="776" width="84" height="3" rx="1.5" opacity="0.55" />
        <rect x="850" y="816" width="118" height="4" rx="2" opacity="0.45" />
        <rect x="836" y="870" width="146" height="4" rx="2" opacity="0.32" />
        <rect x="818" y="936" width="186" height="5" rx="2.5" opacity="0.2" />
      </g>
      <g fill="#ffbe5c" className="twinkle twinkle-2">
        <rect x="684" y="756" width="30" height="3" rx="1.5" opacity="0.55" />
        <rect x="728" y="766" width="42" height="3" rx="1.5" opacity="0.5" />
        <rect x="786" y="760" width="30" height="3" rx="1.5" opacity="0.45" />
        <rect x="716" y="792" width="62" height="3" rx="1.5" opacity="0.3" />
      </g>

      {/* The canoe */}
      <ellipse cx="730" cy="893" rx="122" ry="7" fill="#02070a" opacity="0.6" />
      <path d="M622 858Q726 884 838 852Q822 890 730 891Q640 890 622 858Z" fill="#a4532c" />
      <path d="M622 858Q726 884 838 852" stroke="#e0a26c" strokeWidth="3" fill="none" />
      <path d="M700 876L760 846" stroke="#d9b98a" strokeWidth="4" strokeLinecap="round" />
      <path d="M696 878L684 886" stroke="#d9b98a" strokeWidth="9" strokeLinecap="round" />

      {/* Near bank */}
      <path d="M-60 1000V950Q340 930 760 972T1660 940V1000Z" fill="#020b09" />
    </>
  );
}

const fireflies = Array.from({ length: 16 }, (_, i) => ({
  left: `${8 + (i * 37 + 13) % 84}%`,
  top: `${56 + (i * 29 + 7) % 34}%`,
  delay: `${-((i * 1.3) % 8)}s`,
  duration: `${7 + (i % 5)}s`,
  phone: i % 2 === 0,
}));

function Fireflies() {
  return (
    <>
      {fireflies.map((f) => (
        <div
          key={f.left + f.top}
          className={`firefly ${f.phone ? "" : "hidden md:block"}`}
          style={{ left: f.left, top: f.top, animationDelay: f.delay, animationDuration: f.duration }}
        />
      ))}
    </>
  );
}

function Boughs() {
  return (
    <>
      {[boughLeft, boughRight].map(({ d, flip }) => (
        <svg
          key={d.length}
          viewBox="0 0 420 240"
          className={`absolute top-10 w-[62%] md:w-[30%] ${flip ? "right-0 -scale-x-100" : "left-0"}`}
        >
          <path d={d} stroke="#010806" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      ))}
    </>
  );
}

function Defs() {
  return (
    <svg className="absolute w-0 h-0">
      <defs>
        <linearGradient id="peakFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.3" stopColor="#1b4150" />
          <stop offset="0.75" stopColor="#0f2f38" />
        </linearGradient>
        <linearGradient id="peakNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.4" stopColor="#163c42" />
          <stop offset="0.8" stopColor="#0e2c2e" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d3238" />
          <stop offset="0.45" stopColor="#0a2730" />
          <stop offset="1" stopColor="#030d12" />
        </linearGradient>
        <linearGradient id="falls" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9cfe0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#e6f6ff" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="windowLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe29a" />
          <stop offset="1" stopColor="#ffab3d" />
        </linearGradient>
        <radialGradient id="lodgeGlow">
          <stop offset="0" stopColor="#ffb54d" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffb54d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonHalo">
          <stop offset="0.25" stopColor="#f6f1dc" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f6f1dc" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="puff">
          <stop offset="0" stopColor="#dfeaf0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#dfeaf0" stopOpacity="0" />
        </radialGradient>
        <clipPath id="lakeOnly">
          <rect x="-60" y="738" width="1720" height="262" />
        </clipPath>
        <radialGradient id="milkyWay">
          <stop offset="0" stopColor="#9fb7e8" stopOpacity="0.2" />
          <stop offset="1" stopColor="#9fb7e8" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
