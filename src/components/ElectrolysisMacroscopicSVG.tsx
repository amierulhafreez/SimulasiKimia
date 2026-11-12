import React from 'react';
import { ElectrolysisOutcome, formatConcentration } from '../data/electrolysisData';

interface Props {
  outcome: ElectrolysisOutcome;
  progress: number; // 0..1
  isRunning: boolean;
  isPaused: boolean;
  showElectrons: boolean;
  showIons: boolean;
}

export const ElectrolysisMacroscopicSVG: React.FC<Props> = ({
  outcome,
  progress,
  isRunning,
  isPaused,
  showElectrons,
  showIons,
}) => {
  const activelyAnimating = isRunning && !isPaused;
  const isSwitchClosed = isRunning;

  // Dynamic solution tint based on KSSM chemistry
  let liquidFill = 'rgba(186, 230, 253, 0.14)';
  let liquidTopStroke = 'rgba(125, 211, 252, 0.45)';
  if (outcome.solutionMode === 'constant_blue') {
    liquidFill = 'rgba(2, 132, 199, 0.65)';
    liquidTopStroke = 'rgba(56, 189, 248, 0.85)';
  } else if (outcome.solutionMode === 'fades_blue') {
    const alpha = Math.max(0.18, 0.68 - progress * 0.48);
    liquidFill = `rgba(14, 165, 233, ${alpha.toFixed(2)})`;
    liquidTopStroke = `rgba(56, 189, 248, ${(0.85 - progress * 0.45).toFixed(2)})`;
  } else if (outcome.solutionMode === 'tints_blue') {
    const alpha = 0.14 + progress * 0.34;
    liquidFill = `rgba(14, 165, 233, ${alpha.toFixed(2)})`;
    liquidTopStroke = `rgba(56, 189, 248, ${(0.45 + progress * 0.35).toFixed(2)})`;
  }

  // Dynamic ammeter reading (scales mildly with concentration & active state)
  const concBoost = outcome.concentration >= 0.5 ? 1.45 : outcome.concentration >= 0.05 ? 0.95 : 0.45;
  const ammeterCurrent = isSwitchClosed ? (1.1 * concBoost).toFixed(2) : '0.00';
  const needleAngle = isSwitchClosed ? Math.min(44, 18 * concBoost) : -42;

  // Submerged anode thinning (active Cu) and cathode Cu plating
  const anodeSubmergedW = outcome.electrodeType === 'kuprum' ? Math.max(8, 18 - progress * 9.5) : 18;
  const depositExtra =
    outcome.cathode.productVisual === 'deposit_cu' ? progress * 7 : 0;

  return (
    <svg
      viewBox="0 0 560 232"
      className="w-full h-[192px] select-none"
      role="img"
      aria-label={`Radas makroskopik elektrolisis ${outcome.electrolyte.name}`}
    >
      <defs>
        <linearGradient id="carbonGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="45%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="copperGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9a3412" />
          <stop offset="45%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="cuDepositGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        <filter id="yellowGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark Stage Plate */}
      <rect x="0" y="0" width="560" height="232" rx="14" fill="#070b14" />

      {/* Header Tag inside Macroscopic Stage */}
      <text x="14" y="19" fill="#94a3b8" fontSize="9.5" fontWeight="700" letterSpacing="0.06em">
        ARAS MAKROSKOPIK • RADAS SEL ELEKTROLISIS
      </text>
      <text x="546" y="19" textAnchor="end" fill="#e2e8f0" fontSize="9.5" fontWeight="600">
        {outcome.electrolyte.formula} ({formatConcentration(outcome.concentration)} mol dm⁻³)
      </text>

      {/* ================= TOP CIRCUIT: WIRES, BATTERY, SWITCH, AMMETER ================= */}
      {/* Connecting Wire Left: Anode -> Battery (+) */}
      <path
        d="M 184 95 L 184 42 L 248 42"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Connecting Wire Right: Battery (-) -> Switch -> Ammeter -> Cathode */}
      <path
        d="M 312 42 L 355 42"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
      />
      <path
        d="M 392 42 L 418 42"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
      />
      <path
        d="M 452 42 L 376 42 L 376 42"
        fill="none"
      />
      {/* Continuous full right wire path over/through ammeter */}
      <path
        d="M 388 42 L 418 42 M 450 42 L 456 42 L 456 68 L 376 68 L 376 95"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Wait: make right wire super clean single horizontal run -> drop to Cathode! */}
      <rect x="308" y="36" width="160" height="65" fill="#070b14" />
      <path
        d="M 310 42 L 335 42"
        fill="none"
        stroke="#64748b"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 372 42 L 395 42"
        fill="none"
        stroke="#64748b"
        strokeWidth="3"
      />
      <path
        d="M 432 42 L 456 42 L 456 76 L 376 76 L 376 95"
        fill="none"
        stroke="#64748b"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Clean top-left wire redraw in matching #64748b */}
      <path
        d="M 184 95 L 184 42 L 248 42"
        fill="none"
        stroke="#64748b"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Battery Box (Center Top x=248..312, y=26..58) */}
      <rect x="248" y="27" width="62" height="30" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      {/* Battery Cell Plates */}
      <line x1="268" y1="33" x2="268" y2="51" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="276" y1="37" x2="276" y2="47" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="284" y1="33" x2="284" y2="51" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="292" y1="37" x2="292" y2="47" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
      <text x="255" y="45" fill="#f87171" fontSize="11" fontWeight="900">+</text>
      <text x="299" y="45" fill="#38bdf8" fontSize="12" fontWeight="900">−</text>
      <text x="279" y="68" textAnchor="middle" fill="#cbd5e1" fontSize="8.5" fontWeight="700">
        Bateri 6V DC
      </text>

      {/* Switch (x=335..372, y=42) */}
      <circle cx="335" cy="42" r="3" fill="#e2e8f0" />
      <circle cx="372" cy="42" r="3" fill="#e2e8f0" />
      {isSwitchClosed ? (
        <line x1="335" y1="42" x2="372" y2="42" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <line x1="335" y1="42" x2="366" y2="29" stroke="#f87171" strokeWidth="2.8" strokeLinecap="round" />
      )}
      <text x="353" y="57" textAnchor="middle" fill={isSwitchClosed ? '#facc15' : '#94a3b8'} fontSize="8" fontWeight="700">
        {isSwitchClosed ? 'Suis Tutup' : 'Suis Buka'}
      </text>

      {/* Ammeter (Center x=414, y=42, r=18) */}
      <circle
        cx="414"
        cy="42"
        r="17"
        fill="#0f172a"
        stroke={isSwitchClosed ? '#38bdf8' : '#475569'}
        strokeWidth="2"
      />
      <text x="414" y="38" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="800">
        A
      </text>
      <line
        x1="414"
        y1="49"
        x2={414 + Math.sin((needleAngle * Math.PI) / 180) * 11}
        y2={49 - Math.cos((needleAngle * Math.PI) / 180) * 11}
        stroke={isSwitchClosed ? '#facc15' : '#94a3b8'}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <text x="414" y="68" textAnchor="middle" fill="#38bdf8" fontSize="8.5" fontWeight="700">
        {ammeterCurrent} A
      </text>

      {/* Flowing Yellow Electrons in Wire (Anod -> Battery +, and Battery - -> Katod) */}
      {showElectrons && isSwitchClosed && (
        <g filter="url(#yellowGlow)">
          {/* From Anode (+) UP into Battery (+) */}
          {[0, 0.7, 1.4].map((delay, i) => (
            <circle key={`ew-l-${i}`} r="3.3" fill="#facc15" stroke="#fef08a" strokeWidth="0.7">
              {activelyAnimating && (
                <animateMotion
                  dur="2.1s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  path="M 184 95 L 184 42 L 248 42"
                />
              )}
              {!activelyAnimating && <set attributeName="cx" to={184 + i * 22} />}
            </circle>
          ))}
          {/* From Battery (-) OUT through Switch & Ammeter to Cathode (-) */}
          {[0, 0.7, 1.4].map((delay, i) => (
            <circle key={`ew-r-${i}`} r="3.3" fill="#facc15" stroke="#fef08a" strokeWidth="0.7">
              {activelyAnimating && (
                <animateMotion
                  dur="2.3s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  path="M 310 42 L 456 42 L 456 76 L 376 76 L 376 95"
                />
              )}
              {!activelyAnimating && <set attributeName="cx" to={330 + i * 36} />}
            </circle>
          ))}

          {/* Clear directional labels for e- flow */}
          <text x="206" y="34" fill="#facc15" fontSize="8.5" fontWeight="800">
            e⁻ →
          </text>
          <text x="456" y="33" textAnchor="middle" fill="#facc15" fontSize="8.5" fontWeight="800">
            e⁻ → Katod
          </text>
        </g>
      )}

      {/* ================= BEAKER & ELECTROLYTE ================= */}
      {/* Beaker Inner Backdrop */}
      <rect x="115" y="102" width="330" height="110" rx="10" fill="#0b1222" />

      {/* Electrolyte Liquid */}
      <rect x="117" y="130" width="326" height="80" rx="8" fill={liquidFill} />
      <line x1="117" y1="130" x2="443" y2="130" stroke={liquidTopStroke} strokeWidth="2" />

      {/* Ion Flow Direction Overlay inside Electrolyte */}
      {showIons && (
        <g opacity={isSwitchClosed ? 0.95 : 0.55}>
          {/* Anions drifting LEFT toward Anode (+) */}
          <g>
            <line x1="270" y1="168" x2="212" y2="168" stroke="#f43f5e" strokeWidth="1.8" strokeDasharray="3 2" />
            <polygon points="212,164 204,168 212,172" fill="#f43f5e" />
            <text x="240" y="162" textAnchor="middle" fill="#fda4af" fontSize="8.5" fontWeight="700">
              Anion (−) → Anod
            </text>
          </g>
          {/* Cations drifting RIGHT toward Cathode (-) */}
          <g>
            <line x1="290" y1="188" x2="348" y2="188" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 2" />
            <polygon points="348,184 356,188 348,192" fill="#38bdf8" />
            <text x="320" y="200" textAnchor="middle" fill="#7dd3fc" fontSize="8.5" fontWeight="700">
              Kation (+) → Katod
            </text>
          </g>
        </g>
      )}

      {/* ================= ANODE (+) LEFT (Center x=184) ================= */}
      <g>
        {/* Top wire clip */}
        <rect x="179" y="92" width="10" height="6" rx="2" fill="#ef4444" />
        {/* Upper unsubmerged electrode */}
        <rect
          x={184 - 9}
          y="98"
          width="18"
          height="32"
          rx="2"
          fill={outcome.electrodeType === 'kuprum' ? 'url(#copperGrad)' : 'url(#carbonGrad)'}
          stroke="#94a3b8"
          strokeWidth="0.6"
        />
        {/* Lower submerged electrode (thins if Active Copper) */}
        <rect
          x={184 - anodeSubmergedW / 2}
          y="130"
          width={anodeSubmergedW}
          height="66"
          rx="2"
          fill={outcome.electrodeType === 'kuprum' ? 'url(#copperGrad)' : 'url(#carbonGrad)'}
          stroke={outcome.electrodeType === 'kuprum' ? '#fdba74' : '#64748b'}
          strokeWidth="0.6"
        />

        {/* Label pill Anod (+) */}
        <rect x="122" y="99" width="52" height="18" rx="5" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
        <text x="148" y="111" textAnchor="middle" fill="#fecaca" fontSize="9.5" fontWeight="800">
          Anod (+)
        </text>

        {/* Anode Gas Bubbles (O2 or Cl2) */}
        {activelyAnimating && outcome.anode.productVisual !== 'copper_dissolve' && (
          <g>
            {[0, 0.45, 0.9, 1.35].map((d, i) => (
              <circle
                key={`ab-${i}`}
                cx={176 + (i % 2) * 16}
                cy="185"
                r={2.5 + (i % 2)}
                fill={outcome.anode.productVisual === 'gas_cl2' ? '#bef264' : '#ffffff'}
                opacity="0.9"
              >
                <animate attributeName="cy" values="190;132" dur="1.3s" begin={`${d}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.95;0" dur="1.3s" begin={`${d}s`} repeatCount="indefinite" />
              </circle>
            ))}
            {outcome.anode.productVisual === 'gas_cl2' && (
              <ellipse cx="184" cy="124" rx="22" ry="7" fill="rgba(190, 242, 100, 0.25)" />
            )}
          </g>
        )}

        {/* Active Copper Anode thin label if eroding */}
        {isSwitchClosed && outcome.anode.productVisual === 'copper_dissolve' && progress > 0.15 && (
          <text x="148" y="146" textAnchor="middle" fill="#fdba74" fontSize="8" fontWeight="700">
            Menipis
          </text>
        )}
      </g>

      {/* ================= CATHODE (−) RIGHT (Center x=376) ================= */}
      <g>
        {/* Top wire clip */}
        <rect x="371" y="92" width="10" height="6" rx="2" fill="#3b82f6" />
        {/* Base electrode */}
        <rect
          x={376 - 9}
          y="98"
          width="18"
          height="98"
          rx="2"
          fill={outcome.electrodeType === 'kuprum' ? 'url(#copperGrad)' : 'url(#carbonGrad)'}
          stroke="#94a3b8"
          strokeWidth="0.6"
        />
        {/* Reddish-Brown Copper Deposit Layer growing on submerged Cathode */}
        {depositExtra > 0.3 && (
          <rect
            x={376 - 9 - depositExtra}
            y="131"
            width={18 + depositExtra * 2}
            height="66"
            rx="3.5"
            fill="url(#cuDepositGrad)"
            stroke="#fb923c"
            strokeWidth="0.9"
          />
        )}

        {/* Label pill Katod (-) */}
        <rect x="389" y="99" width="54" height="18" rx="5" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
        <text x="416" y="111" textAnchor="middle" fill="#bae6fd" fontSize="9.5" fontWeight="800">
          Katod (−)
        </text>

        {/* Cathode Gas Bubbles (H2) */}
        {activelyAnimating && outcome.cathode.productVisual === 'gas_h2' && (
          <g>
            {[0, 0.28, 0.56, 0.84, 1.12].map((d, i) => (
              <circle
                key={`cb-${i}`}
                cx={366 + (i % 3) * 10}
                cy="185"
                r={2.3 + (i % 2)}
                fill="#f8fafc"
                opacity="0.92"
              >
                <animate attributeName="cy" values="192;131" dur="0.95s" begin={`${d}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="0.95s" begin={`${d}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}

        {isSwitchClosed && outcome.cathode.productVisual === 'deposit_cu' && progress > 0.15 && (
          <text x="415" y="146" textAnchor="middle" fill="#fdba74" fontSize="8" fontWeight="700">
            Enapan Cu
          </text>
        )}
      </g>

      {/* Beaker Outer Crisp Glass Frame */}
      <path
        d="M 110 96 L 115 103 L 115 204 Q 115 212 124 212 L 436 212 Q 445 212 445 204 L 445 103 L 450 96"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Callout Magnifier Connectors pointing to Dual Submicroscopic Lenses below */}
      <line x1="184" y1="196" x2="145" y2="232" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.65" />
      <line x1="376" y1="196" x2="415" y2="232" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.65" />

      {/* Center Electrode Material Pill & Progress */}
      <text x="280" y="226" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontWeight="700">
        Elektrod: {outcome.electrodeType === 'karbon' ? 'Karbon (Lengai)' : 'Kuprum (Aktif)'} • Kemajuan: {Math.round(progress * 100)}%
      </text>
    </svg>
  );
};
