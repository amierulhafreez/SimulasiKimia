import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Simulation3DGraphic } from './Simulation3DGraphic';

interface AppleHeroShowcaseProps {
  onLaunchById: (simId: string) => void;
}

export const AppleHeroShowcase: React.FC<AppleHeroShowcaseProps> = ({ onLaunchById }) => {
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId = 0;
    const updateParallax = () => {
      rafId = 0;
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Normalized progress (-1 .. 1) around center of viewport
      const progress = Math.max(-1, Math.min(1, (vh * 0.55 - (rect.top + rect.height * 0.5)) / vh));
      el.style.setProperty('--parallax', progress.toFixed(4));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      style={{ '--parallax': '0' } as React.CSSProperties}
      className="relative max-w-5xl mx-auto mt-6 sm:mt-7"
    >
      {/* Ambient studio halo behind display */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -top-6 -bottom-6 rounded-[48px] bg-gradient-to-b from-sky-200/35 via-indigo-200/20 to-transparent blur-3xl opacity-80"
      />

      {/* Apple Studio Hardware Frame */}
      <div className="relative rounded-[28px] sm:rounded-[34px] bg-[#0d0d10] border border-white/15 shadow-[0_36px_90px_-24px_rgba(0,0,0,0.45)] overflow-hidden p-4 sm:p-6">
        {/* Subtle studio radial overhead lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(96,165,250,0.22),transparent_58%),radial-gradient(ellipse_at_85%_80%,rgba(52,211,153,0.14),transparent_55%)]"
        />

        {/* Minimal Apple Display Top Chrome */}
        <div className="relative z-10 flex items-center justify-between px-2 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          </div>
          <div className="text-[11px] font-medium text-white/55 tracking-wide">
            Studio Makmal Maya · KSSM Tingkatan 4 &amp; 5
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interaktif</span>
          </div>
        </div>

        {/* Centerpiece Visual Grid (3 Studio Chemistry Chambers with Scrollytelling Parallax) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 items-center">
          {/* LEFT STUDIO MODULE: Keadaan Zarah (Moves up slightly on scroll) */}
          <button
            type="button"
            onClick={() => onLaunchById('keadaan-zarah-jirim')}
            style={{
              transform: 'translate3d(0, calc(var(--parallax) * -14px), 0)',
            }}
            className="md:col-span-4 group text-left rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-sky-400/40 p-4 transition-colors duration-300 cursor-pointer will-change-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-300/90">
                Tingkatan 4 · Bab 2
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition" />
            </div>

            <div className="h-28 flex items-center justify-center">
              <div className="w-[180px] h-[112px]">
                <Simulation3DGraphic simulationId="keadaan-zarah-jirim" uidPrefix="hero" />
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">Keadaan Zarah</div>
                <div className="text-[11px] text-white/50 truncate">Pepejal · Cecair · Gas</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-[10px] font-mono text-sky-200 shrink-0">
                Kinetik
              </span>
            </div>
          </button>

          {/* CENTER HERO MODULE: Melukis Formula Struktur Sebatian Karbon (Scales gently on scroll) */}
          <button
            type="button"
            onClick={() => onLaunchById('formula-struktur-karbon')}
            style={{
              transform: 'scale(calc(1 + var(--parallax) * 0.035))',
            }}
            className="md:col-span-4 group text-left rounded-2xl bg-gradient-to-b from-white/[0.09] to-white/[0.03] hover:from-white/[0.13] hover:to-white/[0.05] border border-white/20 hover:border-blue-400/50 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-colors duration-300 cursor-pointer will-change-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                Tingkatan 5 · Bab 2
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition" />
            </div>

            <div className="h-32 flex items-center justify-center">
              <div className="w-[195px] h-[126px]">
                <Simulation3DGraphic simulationId="formula-struktur-karbon" uidPrefix="hero" />
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white leading-snug">
                  Melukis Formula Struktur Sebatian Karbon
                </div>
                <div className="text-[11px] text-white/55 truncate">Alkana · Alkena · Alkohol</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071e3] text-[10px] font-semibold text-white shrink-0">
                Buka
              </span>
            </div>
          </button>

          {/* RIGHT STUDIO MODULE: Keterlarutan Garam Dalam Air (Moves down subtly on scroll) */}
          <button
            type="button"
            onClick={() => onLaunchById('keterlarutan-garam')}
            style={{
              transform: 'translate3d(0, calc(var(--parallax) * 14px), 0)',
            }}
            className="md:col-span-4 group text-left rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 p-4 transition-colors duration-300 cursor-pointer will-change-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300/90">
                Tingkatan 4 · Bab 6
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition" />
            </div>

            <div className="h-28 flex items-center justify-center">
              <div className="w-[180px] h-[112px]">
                <Simulation3DGraphic simulationId="keterlarutan-garam" uidPrefix="hero" />
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  Keterlarutan Garam Dalam Air
                </div>
                <div className="text-[11px] text-white/50 truncate">Larut vs Tak Larut</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-[10px] font-mono text-amber-200 shrink-0">
                Garam
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
