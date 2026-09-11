import React, { useState, useEffect } from 'react';
import { Patient } from '../types/spine';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Maximize2, 
  Scan, 
  Eye, 
  CheckCircle2, 
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';

interface Surgery2DXRayViewerProps {
  patient: Patient;
  height?: string | number;
  variant?: 'inline' | 'full';
  onExpand?: () => void;
}

export const Surgery2DXRayViewer: React.FC<Surgery2DXRayViewerProps> = ({
  patient,
  height = '100%',
  variant = 'inline',
  onExpand
}) => {
  const [viewAngle, setViewAngle] = useState<'LATERAL' | 'AP'>('LATERAL');
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(true);
  const [animStage, setAnimStage] = useState<'preop' | 'reduction' | 'fixed'>('fixed');
  const [activeImplant, setActiveImplant] = useState<string | null>(null);
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [invertColors, setInvertColors] = useState<boolean>(false);

  const isCervical = patient.spineRegion === 'cervical';
  const isScoliosis = patient.plannedProcedure.toLowerCase().includes('scoliosis');
  const isMicro = patient.plannedProcedure.toLowerCase().includes('microscopic') && !patient.plannedProcedure.toLowerCase().includes('fusion');
  const procedure = patient.plannedProcedure;
  const levels = patient.affectedLevels;

  // Auto-cycle animation stages when playing
  useEffect(() => {
    if (!isPlayingAnimation) return;
    const interval = setInterval(() => {
      setAnimStage(prev => {
        if (prev === 'preop') return 'reduction';
        if (prev === 'reduction') return 'fixed';
        return 'fixed';
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isPlayingAnimation]);

  const restartAnimation = () => {
    setAnimStage('preop');
    setIsPlayingAnimation(true);
  };

  // Determine levels to draw
  const displayLevels = isCervical 
    ? ['C3', 'C4', 'C5', 'C6', 'C7']
    : isScoliosis 
    ? ['T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'L1']
    : ['L2', 'L3', 'L4', 'L5', 'S1'];

  // Colors based on radiograph mode
  const bg = invertColors ? '#f8fafc' : '#070b12';
  const boneFill = invertColors ? 'rgba(30, 41, 59, 0.14)' : 'rgba(255, 255, 255, 0.16)';
  const boneStroke = invertColors ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.45)';
  const hardwareColor = invertColors ? '#0071e3' : '#ffffff';
  const hardwareGlow = invertColors ? 'rgba(0, 113, 227, 0.4)' : 'rgba(255, 255, 255, 0.8)';
  const tantalumPinColor = '#facc15'; // Radiopaque tantalum marker bead

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius: variant === 'inline' ? '12px' : '16px',
      overflow: 'hidden',
      background: bg,
      border: invertColors ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* C-Arm Fluoroscopy Laser Scan Beam Animation */}
      {isPlayingAnimation && (
        <div 
          className="c-arm-scanline"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #38bdf8, #ffffff, #38bdf8, transparent)',
            boxShadow: '0 0 12px #38bdf8, 0 0 24px #38bdf8',
            zIndex: 15,
            pointerEvents: 'none',
            animation: 'scanline 2.8s ease-in-out infinite alternate'
          }}
        />
      )}

      {/* Top Clinical Header Bar */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '10px',
        right: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        pointerEvents: 'none'
      }}>
        {/* Fluoro Status Pill */}
        <div style={{
          background: invertColors ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          border: invertColors ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.15)',
          padding: '3px 9px',
          borderRadius: '999px',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px #22c55e'
          }} />
          <span style={{ fontSize: '10.5px', fontWeight: 700, color: invertColors ? '#0f172a' : '#f8fafc' }}>
            2D Executed Surgery X-Ray
          </span>
          <span style={{
            background: 'rgba(0, 113, 227, 0.2)',
            color: '#38bdf8',
            fontSize: '9.5px',
            fontWeight: 700,
            padding: '1px 5px',
            borderRadius: '999px'
          }}>
            {viewAngle} View
          </span>
        </div>

        {/* View Angle and Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setViewAngle(prev => prev === 'LATERAL' ? 'AP' : 'LATERAL')}
            style={{
              border: invertColors ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.18)',
              background: invertColors ? '#ffffff' : 'rgba(15, 23, 42, 0.85)',
              color: invertColors ? '#1e293b' : '#f8fafc',
              padding: '3px 8px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)'
            }}
            title="Toggle between Lateral (Sagittal) and AP (Coronal) X-Ray projection"
          >
            {viewAngle === 'LATERAL' ? 'Switch to AP' : 'Switch to Lateral'}
          </button>

          <button
            onClick={restartAnimation}
            style={{
              border: invertColors ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.18)',
              background: invertColors ? '#ffffff' : 'rgba(15, 23, 42, 0.85)',
              color: '#38bdf8',
              padding: '3px 6px',
              borderRadius: '999px',
              fontSize: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            title="Replay surgical reduction animation"
          >
            <RotateCcw size={10} />
          </button>

          {onExpand && (
            <button
              onClick={onExpand}
              style={{
                border: invertColors ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.18)',
                background: invertColors ? '#ffffff' : 'rgba(15, 23, 42, 0.85)',
                color: invertColors ? '#1e293b' : '#f8fafc',
                padding: '3px 7px',
                borderRadius: '999px',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Full screen X-Ray DICOM viewer"
            >
              <Maximize2 size={10} />
            </button>
          )}
        </div>
      </div>

      {/* SVG 2D Spine & Executed Surgery X-Ray Canvas */}
      <div style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden' }}>
        <svg
          viewBox={isScoliosis ? "0 0 400 320" : isCervical ? "0 0 360 220" : "0 0 360 230"}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            {/* Soft bone density gradient */}
            <radialGradient id="boneGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={invertColors ? "#334155" : "#ffffff"} stopOpacity="0.18" />
              <stop offset="100%" stopColor={invertColors ? "#1e293b" : "#cbd5e1"} stopOpacity="0.08" />
            </radialGradient>

            {/* Metallic Titanium Screw Glow */}
            <filter id="metallicGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Cortical dense bone filter */}
            <filter id="cortexShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#38bdf8" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Grid / Exposure background markers */}
          <g opacity={invertColors ? 0.08 : 0.04}>
            <circle cx="180" cy="115" r="90" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="180" y1="10" x2="180" y2="220" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="20" y1="115" x2="340" y2="115" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" />
          </g>

          {/* RENDER ANATOMY & EXECUTED SURGERY */}
          {viewAngle === 'LATERAL' ? (
            <LateralXRayView
              patient={patient}
              displayLevels={displayLevels}
              animStage={animStage}
              boneFill={boneFill}
              boneStroke={boneStroke}
              hardwareColor={hardwareColor}
              hardwareGlow={hardwareGlow}
              tantalumPinColor={tantalumPinColor}
              invertColors={invertColors}
              activeImplant={activeImplant}
              setActiveImplant={setActiveImplant}
            />
          ) : (
            <APXRayView
              patient={patient}
              displayLevels={displayLevels}
              animStage={animStage}
              boneFill={boneFill}
              boneStroke={boneStroke}
              hardwareColor={hardwareColor}
              hardwareGlow={hardwareGlow}
              tantalumPinColor={tantalumPinColor}
              invertColors={invertColors}
              activeImplant={activeImplant}
              setActiveImplant={setActiveImplant}
            />
          )}
        </svg>
      </div>

      {/* Bottom Status / Implant Inspection Pill */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '10px',
        right: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 20
      }}>
        <div style={{
          background: invertColors ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          border: invertColors ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '999px',
          padding: '2px 9px',
          fontSize: '10px',
          fontWeight: 600,
          color: invertColors ? '#334155' : '#e2e8f0',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ color: '#38bdf8' }}>●</span>
          <span>{activeImplant ? activeImplant : (isCervical ? 'C5-C6 ACDF: Plate & PEEK Cage Fixed' : isMicro ? 'L5-S1 Microdiscectomy Window' : `${levels.join('-')} Pedicle Screw & Rod Fixation`)}</span>
        </div>

        <span style={{
          fontSize: '9.5px',
          color: invertColors ? '#94a3b8' : 'rgba(255, 255, 255, 0.4)',
          fontFamily: 'var(--font-mono)'
        }}>
          Fluoro: 18.4 mGy.cm²
        </span>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 10%; opacity: 0.8; }
          50% { top: 85%; opacity: 1; }
          100% { top: 10%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// 2D LATERAL X-RAY VIEW (SAGITTAL RADIOGRAPH)
// ============================================================================

interface XRayViewProps {
  patient: Patient;
  displayLevels: string[];
  animStage: 'preop' | 'reduction' | 'fixed';
  boneFill: string;
  boneStroke: string;
  hardwareColor: string;
  hardwareGlow: string;
  tantalumPinColor: string;
  invertColors: boolean;
  activeImplant: string | null;
  setActiveImplant: (name: string | null) => void;
}

const LateralXRayView: React.FC<XRayViewProps> = ({
  patient,
  displayLevels,
  animStage,
  boneFill,
  boneStroke,
  hardwareColor,
  hardwareGlow,
  tantalumPinColor,
  invertColors,
  activeImplant,
  setActiveImplant
}) => {
  const isCervical = patient.spineRegion === 'cervical';
  const isScoliosis = patient.plannedProcedure.toLowerCase().includes('scoliosis');
  const isMicro = patient.plannedProcedure.toLowerCase().includes('microscopic');
  const levels = patient.affectedLevels;

  // Geometry parameters
  const startY = isScoliosis ? 24 : (isCervical ? 28 : 34);
  const vHeight = isScoliosis ? 24 : (isCervical ? 26 : 30);
  const vWidth = isScoliosis ? 48 : (isCervical ? 50 : 64);
  const discHeight = isScoliosis ? 8 : (isCervical ? 9 : 11);
  const step = vHeight + discHeight;
  const centerX = 165;

  return (
    <g>
      {/* Render each vertebral body and disc */}
      {displayLevels.map((lvl, idx) => {
        const y = startY + idx * step;
        const isTargeted = levels.includes(lvl as any);

        // Pre-op slip simulation (e.g. L4 spondylolisthesis anterior slip)
        let xOffset = 0;
        if (animStage === 'preop' && lvl === 'L4' && patient.primaryDiagnosis.includes('Spondylolisthesis')) {
          xOffset = 9; // 5mm anterior slip on preop film
        } else if (animStage === 'reduction' && lvl === 'L4') {
          xOffset = 4; // partial reduction
        }

        // Lordosis curve curvature
        const naturalCurve = (idx === 0 || idx === displayLevels.length - 1) ? 2 : (idx === 2 ? -3 : 0);
        const curX = centerX + xOffset + naturalCurve;

        return (
          <g key={lvl}>
            {/* Vertebra Body (Lateral Box with Cortical Endplates) */}
            <g
              onMouseEnter={() => setActiveImplant(`Vertebra ${lvl} - Intact Cortices`)}
              onMouseLeave={() => setActiveImplant(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Cortical shell */}
              <rect
                x={curX - vWidth / 2}
                y={y}
                width={vWidth}
                height={vHeight}
                rx={4}
                fill="url(#boneGrad)"
                stroke={isTargeted ? (invertColors ? '#0284c7' : '#38bdf8') : boneStroke}
                strokeWidth={isTargeted ? 1.5 : 1}
              />

              {/* Endplate radiopaque lines */}
              <line 
                x1={curX - vWidth / 2 + 3} 
                y1={y + 1} 
                x2={curX + vWidth / 2 - 3} 
                y2={y + 1} 
                stroke={invertColors ? '#334155' : '#ffffff'} 
                strokeWidth={1.5} 
                opacity={0.6} 
              />
              <line 
                x1={curX - vWidth / 2 + 3} 
                y1={y + vHeight - 1} 
                x2={curX + vWidth / 2 - 3} 
                y2={y + vHeight - 1} 
                stroke={invertColors ? '#334155' : '#ffffff'} 
                strokeWidth={1.5} 
                opacity={0.6} 
              />

              {/* Spinous Process Posterior Shadow */}
              <path
                d={`M ${curX - vWidth / 2} ${y + vHeight * 0.3} L ${curX - vWidth / 2 - 24} ${y + vHeight * 0.75} L ${curX - vWidth / 2} ${y + vHeight * 0.9} Z`}
                fill={boneFill}
                stroke={boneStroke}
                strokeWidth={0.8}
                opacity={0.7}
              />

              {/* Level Label */}
              <text
                x={curX + vWidth / 2 + 10}
                y={y + vHeight * 0.65}
                fill={invertColors ? '#64748b' : 'rgba(255, 255, 255, 0.45)'}
                fontSize={10}
                fontFamily="var(--font-mono)"
                fontWeight={600}
              >
                {lvl}
              </text>
            </g>

            {/* Intervertebral Disc Space & Interbody Cage */}
            {idx < displayLevels.length - 1 && (
              <g>
                {/* Disc radiolucent space */}
                <rect
                  x={curX - vWidth / 2 + 2}
                  y={y + vHeight}
                  width={vWidth - 4}
                  height={discHeight}
                  fill="none"
                  stroke={invertColors ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'}
                />

                {/* Executed Interbody Fusion Cage (PEEK with 2 Radiopaque Tantalum Pins) */}
                {animStage !== 'preop' && isTargeted && !isMicro && levels.includes(displayLevels[idx + 1] as any) && (
                  <g
                    onMouseEnter={() => setActiveImplant(`Radiolucent PEEK Cage (${lvl}-${displayLevels[idx + 1]}) with Tantalum Markers`)}
                    onMouseLeave={() => setActiveImplant(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Radiolucent PEEK cage outline */}
                    <rect
                      x={curX - 16}
                      y={y + vHeight + 1}
                      width={34}
                      height={discHeight - 2}
                      rx={2}
                      fill={invertColors ? 'rgba(0, 113, 227, 0.12)' : 'rgba(56, 189, 248, 0.12)'}
                      stroke={invertColors ? '#0071e3' : '#38bdf8'}
                      strokeWidth={1}
                      strokeDasharray="2 2"
                    />

                    {/* Anterior Tantalum radiopaque pin */}
                    <circle cx={curX + 12} cy={y + vHeight + discHeight / 2} r={1.6} fill={tantalumPinColor} filter="url(#metallicGlow)" />
                    {/* Posterior Tantalum radiopaque pin */}
                    <circle cx={curX - 11} cy={y + vHeight + discHeight / 2} r={1.6} fill={tantalumPinColor} filter="url(#metallicGlow)" />
                  </g>
                )}
              </g>
            )}

            {/* EXECUTED PEDICLE SCREWS (High-Density Radiopaque Metallic White) */}
            {animStage !== 'preop' && isTargeted && !isCervical && !isMicro && (
              <g
                onMouseEnter={() => setActiveImplant(`${lvl} Transpedicular Titanium Screw (6.5 x 45mm)`)}
                onMouseLeave={() => setActiveImplant(null)}
                style={{ cursor: 'pointer' }}
                filter="url(#metallicGlow)"
              >
                {/* Tulip Head (Posterior) */}
                <rect
                  x={curX - vWidth / 2 - 14}
                  y={y + vHeight * 0.3}
                  width={6}
                  height={8}
                  rx={1}
                  fill={hardwareColor}
                />
                {/* Screw Shank traversing into body */}
                <polygon
                  points={`
                    ${curX - vWidth / 2 - 8},${y + vHeight * 0.38}
                    ${curX + 14},${y + vHeight * 0.44}
                    ${curX + 14},${y + vHeight * 0.56}
                    ${curX - vWidth / 2 - 8},${y + vHeight * 0.62}
                  `}
                  fill={hardwareColor}
                />
                {/* Screw Threads */}
                {[-2, 3, 8].map(tx => (
                  <line
                    key={tx}
                    x1={curX + tx}
                    y1={y + vHeight * 0.4}
                    x2={curX + tx + 2}
                    y2={y + vHeight * 0.6}
                    stroke={invertColors ? '#ffffff' : '#94a3b8'}
                    strokeWidth={0.8}
                  />
                ))}
              </g>
            )}

            {/* CERVICAL ACDF ANTERIOR PLATE */}
            {animStage !== 'preop' && isCervical && isTargeted && idx === displayLevels.indexOf(levels[0] as any) && (
              <g
                onMouseEnter={() => setActiveImplant(`Anterior Cervical Titanium Locking Plate (C5-C6)`)}
                onMouseLeave={() => setActiveImplant(null)}
                style={{ cursor: 'pointer' }}
                filter="url(#metallicGlow)"
              >
                {/* Anterior Plate flush against bone */}
                <rect
                  x={curX + vWidth / 2 + 2}
                  y={y + 6}
                  width={5}
                  height={step + vHeight - 12}
                  rx={2}
                  fill={hardwareColor}
                />
                {/* C5 Locking Screw */}
                <rect x={curX + vWidth / 2 - 18} y={y + 9} width={20} height={4} rx={1} fill={hardwareColor} />
                {/* C6 Locking Screw */}
                <rect x={curX + vWidth / 2 - 18} y={y + step + 9} width={20} height={4} rx={1} fill={hardwareColor} />
              </g>
            )}

            {/* MICRODISCECTOMY WINDOW MARKER */}
            {isMicro && isTargeted && (
              <g
                onMouseEnter={() => setActiveImplant(`L5-S1 Decompression Interlaminar Fenestration`)}
                onMouseLeave={() => setActiveImplant(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={curX - vWidth / 2 - 4} cy={y + vHeight * 0.5} r={8} fill="none" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="3 3" />
                <text x={curX - vWidth / 2 - 4} y={y + vHeight * 0.5 + 3} textAnchor="middle" fill="#22c55e" fontSize={8} fontWeight={700}>✓</text>
              </g>
            )}
          </g>
        );
      })}

      {/* CONNECTING LONGITUDINAL ROD (Radiopaque Metallic Cylinder) */}
      {animStage !== 'preop' && !isCervical && !isMicro && levels.length >= 2 && (
        <g
          onMouseEnter={() => setActiveImplant(`5.5mm Pre-Contoured Titanium Longitudinal Rod`)}
          onMouseLeave={() => setActiveImplant(null)}
          style={{ cursor: 'pointer' }}
          filter="url(#metallicGlow)"
        >
          {(() => {
            const firstIdx = displayLevels.indexOf(levels[0] as any);
            const lastIdx = displayLevels.indexOf(levels[levels.length - 1] as any);
            if (firstIdx === -1 || lastIdx === -1) return null;

            const rStartY = startY + firstIdx * step + vHeight * 0.2;
            const rEndY = startY + lastIdx * step + vHeight * 0.8;
            const rodX = centerX - vWidth / 2 - 11;

            return (
              <path
                d={`M ${rodX} ${rStartY} Q ${rodX - 2} ${(rStartY + rEndY) / 2} ${rodX} ${rEndY}`}
                stroke={hardwareColor}
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
              />
            );
          })()}
        </g>
      )}
    </g>
  );
};

// ============================================================================
// 2D AP X-RAY VIEW (CORONAL RADIOGRAPH)
// ============================================================================

const APXRayView: React.FC<XRayViewProps> = ({
  patient,
  displayLevels,
  animStage,
  boneFill,
  boneStroke,
  hardwareColor,
  hardwareGlow,
  tantalumPinColor,
  invertColors,
  activeImplant,
  setActiveImplant
}) => {
  const isCervical = patient.spineRegion === 'cervical';
  const isScoliosis = patient.plannedProcedure.toLowerCase().includes('scoliosis');
  const isMicro = patient.plannedProcedure.toLowerCase().includes('microscopic');
  const levels = patient.affectedLevels;

  const startY = isScoliosis ? 24 : (isCervical ? 28 : 34);
  const vHeight = isScoliosis ? 24 : (isCervical ? 26 : 30);
  const vWidth = isScoliosis ? 60 : (isCervical ? 56 : 74);
  const discHeight = isScoliosis ? 8 : (isCervical ? 9 : 11);
  const step = vHeight + discHeight;
  const centerX = 180;

  return (
    <g>
      {displayLevels.map((lvl, idx) => {
        const y = startY + idx * step;
        const isTargeted = levels.includes(lvl as any);

        // Coronal Scoliosis curve simulation on AP
        let scoliosisCurveX = 0;
        if (isScoliosis) {
          if (animStage === 'preop') {
            // Uncorrected Cobb angle curve
            scoliosisCurveX = Math.sin((idx / displayLevels.length) * Math.PI) * 26;
          } else {
            // Corrected curve with rods in place
            scoliosisCurveX = Math.sin((idx / displayLevels.length) * Math.PI) * 7;
          }
        }
        const curX = centerX + scoliosisCurveX;

        return (
          <g key={lvl}>
            {/* Vertebral Body (AP Projection with Pedicle "Owl Eyes") */}
            <g
              onMouseEnter={() => setActiveImplant(`Vertebra ${lvl} - AP View`)}
              onMouseLeave={() => setActiveImplant(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Body */}
              <rect
                x={curX - vWidth / 2}
                y={y}
                width={vWidth}
                height={vHeight}
                rx={4}
                fill="url(#boneGrad)"
                stroke={isTargeted ? (invertColors ? '#0284c7' : '#38bdf8') : boneStroke}
                strokeWidth={isTargeted ? 1.5 : 1}
              />

              {/* Bilateral Transverse Processes */}
              <line x1={curX - vWidth / 2} y1={y + vHeight * 0.4} x2={curX - vWidth / 2 - 14} y2={y + vHeight * 0.3} stroke={boneStroke} strokeWidth={2} />
              <line x1={curX + vWidth / 2} y1={y + vHeight * 0.4} x2={curX + vWidth / 2 + 14} y2={y + vHeight * 0.3} stroke={boneStroke} strokeWidth={2} />

              {/* Midline Spinous Process Shadow */}
              <line x1={curX} y1={y + 4} x2={curX} y2={y + vHeight - 4} stroke={invertColors ? '#334155' : '#ffffff'} strokeWidth={1.5} opacity={0.4} />

              {/* Bilateral Pedicle "Owl Eyes" Rings */}
              <circle cx={curX - vWidth * 0.3} cy={y + vHeight * 0.45} r={5} fill="none" stroke={boneStroke} strokeWidth={1.2} />
              <circle cx={curX + vWidth * 0.3} cy={y + vHeight * 0.45} r={5} fill="none" stroke={boneStroke} strokeWidth={1.2} />

              {/* Level Text */}
              <text
                x={curX + vWidth / 2 + 18}
                y={y + vHeight * 0.6}
                fill={invertColors ? '#64748b' : 'rgba(255, 255, 255, 0.45)'}
                fontSize={9.5}
                fontFamily="var(--font-mono)"
                fontWeight={600}
              >
                {lvl}
              </text>
            </g>

            {/* EXECUTED BILATERAL PEDICLE SCREWS (AP View: Concentric Bullseye Trajectory) */}
            {animStage !== 'preop' && isTargeted && !isCervical && !isMicro && (
              <g
                onMouseEnter={() => setActiveImplant(`${lvl} Bilateral Pedicle Screws (Convergent Trajectory)`)}
                onMouseLeave={() => setActiveImplant(null)}
                style={{ cursor: 'pointer' }}
                filter="url(#metallicGlow)"
              >
                {/* Left Screw Bullseye into Pedicle */}
                <circle cx={curX - vWidth * 0.3} cy={y + vHeight * 0.45} r={4.5} fill={hardwareColor} />
                <line x1={curX - vWidth * 0.3} y1={y + vHeight * 0.45} x2={curX - 10} y2={y + vHeight * 0.45} stroke={hardwareColor} strokeWidth={3} />

                {/* Right Screw Bullseye into Pedicle */}
                <circle cx={curX + vWidth * 0.3} cy={y + vHeight * 0.45} r={4.5} fill={hardwareColor} />
                <line x1={curX + vWidth * 0.3} y1={y + vHeight * 0.45} x2={curX + 10} y2={y + vHeight * 0.45} stroke={hardwareColor} strokeWidth={3} />
              </g>
            )}

            {/* Cervical Plate on AP View */}
            {animStage !== 'preop' && isCervical && isTargeted && (
              <g filter="url(#metallicGlow)">
                <rect x={curX - 10} y={y + 4} width={20} height={vHeight - 8} rx={2} fill={hardwareColor} />
              </g>
            )}
          </g>
        );
      })}

      {/* BILATERAL PARALLEL LONGITUDINAL RODS (AP View) */}
      {animStage !== 'preop' && !isCervical && !isMicro && levels.length >= 2 && (
        <g
          onMouseEnter={() => setActiveImplant(`Bilateral 5.5mm Titanium Spinal Rods in Parallel Symmetry`)}
          onMouseLeave={() => setActiveImplant(null)}
          style={{ cursor: 'pointer' }}
          filter="url(#metallicGlow)"
        >
          {(() => {
            const firstIdx = displayLevels.indexOf(levels[0] as any);
            const lastIdx = displayLevels.indexOf(levels[levels.length - 1] as any);
            if (firstIdx === -1 || lastIdx === -1) return null;

            const rStartY = startY + firstIdx * step + vHeight * 0.15;
            const rEndY = startY + lastIdx * step + vHeight * 0.85;
            const leftRodX = centerX - vWidth * 0.3;
            const rightRodX = centerX + vWidth * 0.3;

            return (
              <g>
                <line x1={leftRodX} y1={rStartY} x2={leftRodX} y2={rEndY} stroke={hardwareColor} strokeWidth={4} strokeLinecap="round" />
                <line x1={rightRodX} y1={rStartY} x2={rightRodX} y2={rEndY} stroke={hardwareColor} strokeWidth={4} strokeLinecap="round" />

                {/* Transverse Crosslink for Deformity / Multi-level */}
                {(isScoliosis || levels.length >= 3) && (
                  <line
                    x1={leftRodX}
                    y1={(rStartY + rEndY) / 2}
                    x2={rightRodX}
                    y2={(rStartY + rEndY) / 2}
                    stroke={hardwareColor}
                    strokeWidth={2.5}
                  />
                )}
              </g>
            );
          })()}
        </g>
      )}
    </g>
  );
};
