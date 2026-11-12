import React from 'react';

export interface UTubeJohnstoneSVGProps {
  leftShortLabel: string;
  rightShortLabel: string;
  leftColorHex: string;
  rightColorHex: string;
  leftReactantIon: string;
  leftProductIon: string;
  leftHalfEq: string;
  rightReactantIon: string;
  rightProductIon: string;
  rightHalfEq: string;
  /** Reaction progress 0..1 */
  progress: number;
  isReacting: boolean;
  /** Which arm did dropper last sample, if any */
  sampledArm: 'left' | 'right' | null;
}

export const UTubeJohnstoneSVG: React.FC<UTubeJohnstoneSVGProps> = ({
  leftShortLabel,
  rightShortLabel,
  leftColorHex,
  rightColorHex,
  leftReactantIon,
  leftProductIon,
  leftHalfEq,
  rightReactantIon,
  rightProductIon,
  rightHalfEq,
  progress,
  isReacting,
  sampledArm,
}) => {
  // Galvanometer needle deflects cleanly to the right (+34 deg) along electron flow L -> R
  const needleAngleDeg = progress > 0 || isReacting ? Math.min(34, 6 + progress * 28) : 0;
  const activeFlow = isReacting || progress > 0.05;

  return (
    <svg
      viewBox="0 0 680 286"
      className="w-full h-auto max-h-[256px] select-none mx-auto"
      role="img"
      aria-label="Radas Tiub-U & Galvanometer bersama Kanta Pembesar Permukaan Elektrod"
    >
      <defs>
        <linearGradient id="graphiteGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="electronGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </radialGradient>
        <marker
          id="eFlowArrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#0284c7" />
        </marker>
      </defs>

      {/* SECTION HEADER */}
      <text x="12" y="15" fontSize="9" fontWeight="800" fill="#64748b">
        ZON ATAS · RADAS TIUB-U &amp; GALVANOMETER (MAKROSKOPIK)
      </text>

      {/* EXTERNAL WIRE CIRCUIT (Left electrode -> Galvanometer -> Right electrode) */}
      <g>
        <path
          d="M 245 58 L 245 34 L 312 34"
          fill="none"
          stroke={activeFlow ? '#0284c7' : '#64748b'}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 368 34 L 435 34 L 435 58"
          fill="none"
          stroke={activeFlow ? '#0284c7' : '#64748b'}
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Electron direction labels on wire */}
        <text x="278" y="25" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0369a1">
          e⁻ →
        </text>
        <text x="402" y="25" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0369a1">
          e⁻ →
        </text>

        {/* Animated electrons gliding along wire Left -> Right */}
        {activeFlow && (
          <g>
            <circle r="4.5" fill="url(#electronGlow)">
              <animateMotion
                dur="1.4s"
                repeatCount="indefinite"
                path="M 245 58 L 245 34 L 435 34 L 435 58"
              />
            </circle>
            <circle r="3.5" fill="#fef08a">
              <animateMotion
                dur="1.4s"
                begin="0.7s"
                repeatCount="indefinite"
                path="M 245 58 L 245 34 L 435 34 L 435 58"
              />
            </circle>
          </g>
        )}
      </g>

      {/* GALVANOMETER (cx = 340, cy = 34) */}
      <g transform="translate(340, 34)">
        <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#334155" strokeWidth="2.2" />
        <circle cx="0" cy="0" r="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        {/* Scale arc & ticks */}
        <path d="M -14 -4 A 15 15 0 0 1 14 -4" fill="none" stroke="#94a3b8" strokeWidth="1.3" />
        <line x1="0" y1="-19" x2="0" y2="-15" stroke="#334155" strokeWidth="1.2" />
        <line x1="-13" y1="-11" x2="-10" y2="-8" stroke="#64748b" strokeWidth="1" />
        <line x1="13" y1="-11" x2="10" y2="-8" stroke="#0284c7" strokeWidth="1.2" />
        <text x="-11" y="2" fontSize="7" fontWeight="800" fill="#64748b" textAnchor="middle">-</text>
        <text x="11" y="2" fontSize="7" fontWeight="800" fill="#0284c7" textAnchor="middle">+</text>
        <text x="0" y="16" fontSize="9.5" fontWeight="900" fill="#1e293b" textAnchor="middle">G</text>

        {/* Deflecting needle */}
        <g transform={`rotate(${needleAngleDeg}, 0, 6)`}>
          <line x1="0" y1="6" x2="0" y2="-16" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="0" cy="6" r="2.6" fill="#1e293b" />
      </g>

      {/* U-TUBE SOLUTIONS & ELECTROLYTE BRIDGE */}
      <g>
        {/* Bottom H2SO4 salt bridge solution */}
        <path
          d="M 224 120 L 224 128 Q 224 172 340 172 Q 456 172 456 128 L 456 120 L 410 120 L 410 124 Q 410 139 340 139 Q 270 139 270 124 L 270 120 Z"
          fill="#e0f2fe"
          fillOpacity="0.85"
        />

        {/* Left arm solution */}
        <rect
          x="224"
          y="78"
          width="46"
          height="46"
          fill={leftColorHex}
          fillOpacity="0.82"
        />
        <ellipse cx="247" cy="78" rx="23" ry="2.6" fill={leftColorHex} />

        {/* Right arm solution */}
        <rect
          x="410"
          y="78"
          width="46"
          height="46"
          fill={rightColorHex}
          fillOpacity="0.82"
        />
        <ellipse cx="433" cy="78" rx="23" ry="2.6" fill={rightColorHex} />

        {/* Sampled highlight ring on left or right arm */}
        {sampledArm === 'left' && (
          <rect x="220" y="74" width="54" height="52" rx="4" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 2" />
        )}
        {sampledArm === 'right' && (
          <rect x="406" y="74" width="54" height="52" rx="4" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 2" />
        )}

        {/* Migrating H+ and SO4(2-) ions in U-bend (H2SO4 salt bridge role) */}
        <g fontSize="7.5" fontWeight="800">
          <g>
            <circle cx="314" cy="155" r="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
            <text x="314" y="157.5" textAnchor="middle" fill="#0369a1">H⁺</text>
            {activeFlow && (
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;18,0;0,0"
                dur="1.8s"
                repeatCount="indefinite"
              />
            )}
          </g>
          <g>
            <circle cx="366" cy="155" r="9.5" fill="#ffffff" stroke="#7c3aed" strokeWidth="1" />
            <text x="366" y="157.5" textAnchor="middle" fill="#6d28d9">SO₄²⁻</text>
            {activeFlow && (
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;-18,0;0,0"
                dur="1.8s"
                repeatCount="indefinite"
              />
            )}
          </g>
        </g>

        {/* Carbon (Graphite) Electrodes */}
        <rect x="240" y="56" width="10" height="58" rx="2" fill="url(#graphiteGrad)" stroke="#0f172a" strokeWidth="1" />
        <rect x="430" y="56" width="10" height="58" rx="2" fill="url(#graphiteGrad)" stroke="#0f172a" strokeWidth="1" />

        {/* U-tube outer & inner glass walls */}
        <path
          d="M 222 64 L 222 128 Q 222 174 340 174 Q 458 174 458 128 L 458 64"
          fill="none"
          stroke="#475569"
          strokeWidth="2.2"
        />
        <path
          d="M 270 64 L 270 122 Q 270 138 340 138 Q 410 138 410 122 L 410 64"
          fill="none"
          stroke="#475569"
          strokeWidth="2.2"
        />
        <ellipse cx="246" cy="64" rx="24" ry="3.2" fill="none" stroke="#475569" strokeWidth="1.6" />
        <ellipse cx="434" cy="64" rx="24" ry="3.2" fill="none" stroke="#475569" strokeWidth="1.6" />
      </g>

      {/* CLEAN MACROSCOPIC POINTER LABELS */}
      <g fontSize="9.2" fontWeight="700" fill="#334155">
        <text x="208" y="64" textAnchor="end">Elektrod karbon (-)</text>
        <line x1="211" y1="61" x2="240" y2="61" stroke="#64748b" strokeWidth="0.9" strokeDasharray="3 2" />

        <text x="208" y="96" textAnchor="end" fill="#0f172a" fontWeight="800">
          {leftShortLabel}
        </text>
        <text x="208" y="107" textAnchor="end" fontSize="8" fill="#64748b">
          Lengan Kiri (Agen Penurunan)
        </text>
        <line x1="211" y1="95" x2="223" y2="95" stroke="#64748b" strokeWidth="0.9" strokeDasharray="3 2" />

        <text x="472" y="64" textAnchor="start">Elektrod karbon (+)</text>
        <line x1="440" y1="61" x2="469" y2="61" stroke="#64748b" strokeWidth="0.9" strokeDasharray="3 2" />

        <text x="472" y="96" textAnchor="start" fill="#0f172a" fontWeight="800">
          {rightShortLabel}
        </text>
        <text x="472" y="107" textAnchor="start" fontSize="8" fill="#64748b">
          Lengan Kanan (Agen Pengoksidaan)
        </text>
        <line x1="457" y1="95" x2="469" y2="95" stroke="#64748b" strokeWidth="0.9" strokeDasharray="3 2" />

        <text x="340" y="187" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#0369a1">
          Asid sulfurik cair, H₂SO₄(ak) · Lengkapkan litar &amp; imbangi cas
        </text>
      </g>

      {/* ZOOM DASHED CONES FROM ELECTRODES TO SUBMICROSCOPIC LOUPES */}
      <line x1="238" y1="112" x2="154" y2="196" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="442" y1="112" x2="526" y2="196" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

      {/* ===================================================================== */}
      {/* ZON BAWAH: LEFT SUBMICROSCOPIC LOUPE (Pengoksidaan, x=12..308)        */}
      {/* ===================================================================== */}
      <g transform="translate(12, 196)">
        <rect x="0" y="0" width="296" height="84" rx="11" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
        {/* Graphite electrode cross-section bar */}
        <rect x="8" y="8" width="24" height="68" rx="4" fill="url(#graphiteGrad)" />
        <text x="20" y="46" textAnchor="middle" fontSize="8" fontWeight="800" fill="#e2e8f0" transform="rotate(-90, 20, 46)">
          Karbon (-)
        </text>

        {/* Ion oxidation animation: reactant touches rod, emits e- upward, becomes product */}
        <circle cx="64" cy="48" r="14" fill="#ffffff" stroke="#0f766e" strokeWidth="1.6" />
        <text x="64" y="51.5" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0f766e">
          {progress > 0.35 ? leftProductIon : leftReactantIon}
        </text>

        {/* Emitted electron entering rod */}
        <path d="M 52 44 L 32 34 L 24 10" fill="none" stroke="#0284c7" strokeWidth="1.6" strokeDasharray="3 2" markerEnd="url(#eFlowArrow)" />
        {activeFlow && (
          <circle cx="38" cy="36" r="4" fill="#0ea5e9" stroke="#fef08a" strokeWidth="1.2">
            <animate attributeName="cy" values="42;12" dur="1.1s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Text explanation inside Loupe */}
        <text x="90" y="21" fontSize="9.5" fontWeight="800" fill="#0f766e">
          Kanta Kiri · Pengoksidaan (-)
        </text>
        <text x="90" y="40" fontSize="8.8" fontWeight="800" fontFamily="monospace" fill="#1e293b">
          {leftHalfEq}
        </text>
        <text x="90" y="57" fontSize="8.5" fontWeight="600" fill="#475569">
          {leftReactantIon} membebaskan e⁻ ke elektrod
        </text>
        <text x="90" y="70" fontSize="8.5" fontWeight="700" fill="#0369a1">
          → e⁻ bergerak ke wayar luar
        </text>
      </g>

      {/* ===================================================================== */}
      {/* ZON BAWAH: RIGHT SUBMICROSCOPIC LOUPE (Penurunan, x=372..668)         */}
      {/* ===================================================================== */}
      <g transform="translate(372, 196)">
        <rect x="0" y="0" width="296" height="84" rx="11" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
        {/* Graphite electrode cross-section bar */}
        <rect x="8" y="8" width="24" height="68" rx="4" fill="url(#graphiteGrad)" />
        <text x="20" y="46" textAnchor="middle" fontSize="8" fontWeight="800" fill="#e2e8f0" transform="rotate(-90, 20, 46)">
          Karbon (+)
        </text>

        {/* Incoming electron descending rod -> ion */}
        <path d="M 24 10 L 32 34 L 50 44" fill="none" stroke="#0284c7" strokeWidth="1.6" strokeDasharray="3 2" markerEnd="url(#eFlowArrow)" />
        {activeFlow && (
          <circle cx="24" cy="22" r="4" fill="#0ea5e9" stroke="#fef08a" strokeWidth="1.2">
            <animate attributeName="cy" values="12;42" dur="1.1s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Reduced product ion */}
        <circle cx="64" cy="48" r="14" fill="#ffffff" stroke="#b45309" strokeWidth="1.6" />
        <text x="64" y="51.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#b45309">
          {progress > 0.35 ? rightProductIon : rightReactantIon}
        </text>

        {/* Text explanation inside Loupe */}
        <text x="90" y="21" fontSize="9.5" fontWeight="800" fill="#b45309">
          Kanta Kanan · Penurunan (+)
        </text>
        <text x="90" y="40" fontSize="8.8" fontWeight="800" fontFamily="monospace" fill="#1e293b">
          {rightHalfEq}
        </text>
        <text x="90" y="57" fontSize="8.5" fontWeight="600" fill="#475569">
          {rightReactantIon} menerima e⁻ dari elektrod
        </text>
        <text x="90" y="70" fontSize="8.5" fontWeight="700" fill="#0369a1">
          → Hasil: {rightProductIon}
        </text>
      </g>
    </svg>
  );
};
