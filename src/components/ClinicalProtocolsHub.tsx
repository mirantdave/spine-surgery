import React, { useState, useMemo } from 'react';
import { Patient, SurgeonUser } from '../types/spine';
import {
  ClinicalProtocol,
  ProtocolCategory,
  ProtocolModuleTarget,
  PatientProtocolCompliance
} from '../types/protocol';
import {
  ALL_CLINICAL_PROTOCOLS,
  PROTOCOL_CATEGORY_ORDER,
  PROTOCOL_CATEGORY_COLORS,
  matchProtocolsToPatient,
  getPatientProtocolCompliance,
  computeProtocolProgress,
  countProtocolSteps,
  countCriticalStops,
  getProtocolLibrarySummary
} from '../data/clinicalProtocols';
import { DataAttributionBadge } from './DataAttributionBadge';
import {
  BookOpenCheck,
  Search,
  ShieldAlert,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  UserCheck,
  Pill,
  Gauge,
  FileSignature,
  Link2,
  Library,
  Target,
  Flag,
  ChevronRight,
  MinusCircle,
  BookMarked
} from 'lucide-react';

interface ClinicalProtocolsHubProps {
  patient: Patient;
  currentSurgeon: SurgeonUser;
  focusProtocolId?: string | null;
  onSaveCompliance: (compliance: PatientProtocolCompliance) => void;
  onNavigateToModule?: (target: ProtocolModuleTarget) => void;
}

const PRIORITY_BADGE: Record<string, { bg: string; color: string; border: string }> = {
  'Mandatory': { bg: 'rgba(0, 113, 227, 0.08)', color: '#0071e3', border: 'rgba(0, 113, 227, 0.22)' },
  'Strongly Recommended': { bg: 'rgba(52, 199, 89, 0.1)', color: '#248a3d', border: 'rgba(52, 199, 89, 0.25)' },
  'Conditional': { bg: 'rgba(255, 149, 0, 0.1)', color: '#b25000', border: 'rgba(255, 149, 0, 0.25)' },
  'Emergency Response': { bg: 'rgba(255, 59, 48, 0.1)', color: '#d70015', border: 'rgba(255, 59, 48, 0.28)' }
};

const SEVERITY_COLOR: Record<string, string> = {
  Watch: '#b25000',
  Escalate: '#c2410c',
  Critical: '#d70015'
};

export const ClinicalProtocolsHub: React.FC<ClinicalProtocolsHubProps> = ({
  patient,
  currentSurgeon,
  focusProtocolId,
  onSaveCompliance,
  onNavigateToModule
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProtocolCategory | 'all'>('all');
  // Selection and scope are remembered against the focus request that was live
  // when the user made them, so a fresh deep-link from another module wins.
  const [selection, setSelection] = useState<{ protocolId: string; forFocus: string | null } | null>(null);
  const [scopeChoice, setScopeChoice] = useState<{ scope: 'patient' | 'library'; forFocus: string | null } | null>(null);

  const summary = useMemo(() => getProtocolLibrarySummary(), []);
  const matches = useMemo(() => matchProtocolsToPatient(patient), [patient]);
  const matchedIds = useMemo(() => new Set(matches.map(m => m.protocol.id)), [matches]);

  const activeFocus = focusProtocolId && ALL_CLINICAL_PROTOCOLS.some(p => p.id === focusProtocolId)
    ? focusProtocolId
    : null;

  // A deep-linked protocol outside the patient-matched set opens the full library.
  const scope: 'patient' | 'library' = scopeChoice && scopeChoice.forFocus === activeFocus
    ? scopeChoice.scope
    : activeFocus && !matchedIds.has(activeFocus) ? 'library' : 'patient';

  const setScope = (next: 'patient' | 'library') => setScopeChoice({ scope: next, forFocus: activeFocus });

  const visibleProtocols = useMemo(() => {
    const base: ClinicalProtocol[] = scope === 'patient'
      ? matches.map(m => m.protocol)
      : ALL_CLINICAL_PROTOCOLS;

    const term = searchTerm.trim().toLowerCase();

    return base.filter(p => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (!term) return true;
      const haystack = [
        p.title,
        p.code,
        p.shortLabel,
        p.summary,
        p.category,
        ...p.indications,
        ...(p.redFlags || []),
        ...p.phases.flatMap(ph => ph.steps.map(s => s.action))
      ].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [scope, matches, searchTerm, categoryFilter]);

  // Selection is derived, so it stays valid as filters, scope and patient change.
  const manualId = selection && selection.forFocus === activeFocus ? selection.protocolId : null;
  const selectedProtocolId =
    (manualId && visibleProtocols.some(p => p.id === manualId) ? manualId : null) ||
    (activeFocus && !manualId ? activeFocus : null) ||
    visibleProtocols[0]?.id ||
    '';

  const setSelectedProtocolId = (protocolId: string) => setSelection({ protocolId, forFocus: activeFocus });

  const selectedProtocol = ALL_CLINICAL_PROTOCOLS.find(p => p.id === selectedProtocolId) || visibleProtocols[0];
  const compliance = selectedProtocol ? getPatientProtocolCompliance(patient, selectedProtocol.id) : undefined;
  const progress = selectedProtocol ? computeProtocolProgress(selectedProtocol, compliance) : undefined;

  const timestamp = () =>
    new Date().toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
    }) + ' IST';

  const persist = (next: PatientProtocolCompliance) => {
    if (!selectedProtocol) return;
    const recomputed = computeProtocolProgress(selectedProtocol, next);
    onSaveCompliance({
      ...next,
      status: next.varianceNote ? 'Variance Documented' : recomputed.status,
      lastUpdatedAt: timestamp(),
      lastUpdatedBy: currentSurgeon.name,
      entryAttribution: {
        enteredByName: currentSurgeon.name,
        enteredByDesignation: currentSurgeon.designation,
        staffTier: currentSurgeon.tier,
        enteredAt: timestamp(),
        verificationStatus: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON'
          ? 'Verified by Consultant'
          : 'Pending Consultant Review',
        verifiedByConsultant: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? currentSurgeon.name : undefined,
        verifiedAt: currentSurgeon.tier === 'CONSULTANT_SPINE_SURGEON' ? timestamp() : undefined
      }
    });
  };

  const currentCompliance = (): PatientProtocolCompliance => compliance || {
    protocolId: selectedProtocol.id,
    completedStepIds: [],
    notApplicableStepIds: [],
    status: 'Not Started',
    lastUpdatedAt: timestamp(),
    lastUpdatedBy: currentSurgeon.name
  };

  const toggleStep = (stepId: string) => {
    const base = currentCompliance();
    const done = base.completedStepIds.includes(stepId);
    persist({
      ...base,
      completedStepIds: done
        ? base.completedStepIds.filter(id => id !== stepId)
        : [...base.completedStepIds, stepId],
      notApplicableStepIds: base.notApplicableStepIds.filter(id => id !== stepId)
    });
  };

  const toggleNotApplicable = (stepId: string) => {
    const base = currentCompliance();
    const marked = base.notApplicableStepIds.includes(stepId);
    persist({
      ...base,
      notApplicableStepIds: marked
        ? base.notApplicableStepIds.filter(id => id !== stepId)
        : [...base.notApplicableStepIds, stepId],
      completedStepIds: base.completedStepIds.filter(id => id !== stepId)
    });
  };

  const saveVariance = (note: string) => {
    const base = currentCompliance();
    persist({ ...base, varianceNote: note.trim() || undefined });
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
  };

  const sectionTitle = (icon: React.ReactNode, text: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
      {icon}
      <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
        {text}
      </h4>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* ---------------- Header ---------------- */}
      <div style={{ ...cardStyle, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <BookOpenCheck size={16} color="#0071e3" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
              Stavya Spine Surgery Clinical Protocol Library
            </h3>
            <span className="badge badge-blue" style={{ fontSize: '10.5px' }}>
              {summary.totalProtocols} Protocols
            </span>
            <span className="badge badge-rose" style={{ fontSize: '10.5px' }}>
              {summary.totalCriticalStops} Critical Stops
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Institutional standard operating protocols across the full surgical continuum — {summary.totalSteps} accountable
            steps, each mapped to a responsible role and to the chart module where it is documented.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2px', background: '#f4f5f7', padding: '3px', borderRadius: '10px' }}>
          {([
            { id: 'patient', label: `For ${patient.name.split(' ')[0]}`, count: matches.length },
            { id: 'library', label: 'Full Library', count: ALL_CLINICAL_PROTOCOLS.length }
          ] as const).map(opt => (
            <button
              key={opt.id}
              onClick={() => setScope(opt.id)}
              style={{
                border: 'none',
                background: scope === opt.id ? '#ffffff' : 'transparent',
                color: scope === opt.id ? '#1d1d1f' : '#6e6e73',
                boxShadow: scope === opt.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: scope === opt.id ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{opt.label}</span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 700,
                background: scope === opt.id ? 'rgba(0, 113, 227, 0.1)' : 'rgba(0,0,0,0.05)',
                color: scope === opt.id ? '#0071e3' : 'var(--text-muted)',
                borderRadius: '999px',
                padding: '1px 6px'
              }}>
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- Search + Category filters ---------------- */}
      <div style={{ ...cardStyle, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          background: 'var(--bg-secondary)', borderRadius: '999px', padding: '5px 12px',
          border: '1px solid var(--border-color)', minWidth: '260px', flex: '0 1 320px'
        }}>
          <Search size={13} color="#86868b" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search protocols, steps, drugs, red flags…"
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontSize: '12px', color: 'var(--text-primary)', flex: 1, fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCategoryFilter('all')}
            style={{
              fontSize: '11px', padding: '4px 11px', borderRadius: '999px', cursor: 'pointer',
              fontWeight: 600,
              background: categoryFilter === 'all' ? 'rgba(0, 113, 227, 0.08)' : 'var(--bg-secondary)',
              color: categoryFilter === 'all' ? '#0071e3' : 'var(--text-secondary)',
              border: `1px solid ${categoryFilter === 'all' ? 'rgba(0, 113, 227, 0.22)' : 'var(--border-color)'}`
            }}
          >
            All Categories
          </button>
          {PROTOCOL_CATEGORY_ORDER.map(cat => {
            const active = categoryFilter === cat;
            const color = PROTOCOL_CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(active ? 'all' : cat)}
                style={{
                  fontSize: '11px', padding: '4px 11px', borderRadius: '999px', cursor: 'pointer',
                  fontWeight: 600,
                  background: active ? `${color}14` : 'var(--bg-secondary)',
                  color: active ? color : 'var(--text-secondary)',
                  border: `1px solid ${active ? `${color}44` : 'var(--border-color)'}`
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------- Master / Detail ---------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '14px', alignItems: 'start' }}>
        {/* Protocol list */}
        <div style={{ ...cardStyle, padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '1100px', overflowY: 'auto' }}>
          {visibleProtocols.length === 0 && (
            <div style={{ padding: '24px 12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              No protocols match this filter.
            </div>
          )}

          {visibleProtocols.map(p => {
            const isActive = selectedProtocol?.id === p.id;
            const color = PROTOCOL_CATEGORY_COLORS[p.category];
            const prog = computeProtocolProgress(p, getPatientProtocolCompliance(patient, p.id));
            const match = matches.find(m => m.protocol.id === p.id);

            return (
              <button
                key={p.id}
                onClick={() => setSelectedProtocolId(p.id)}
                style={{
                  textAlign: 'left',
                  border: `1px solid ${isActive ? `${color}55` : 'var(--border-color)'}`,
                  background: isActive ? `${color}0d` : '#ffffff',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', fontWeight: 700, color }}>
                    {p.code}
                  </span>
                  {p.priority === 'Emergency Response' && (
                    <ShieldAlert size={12} color="#d70015" />
                  )}
                </div>

                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                  {p.shortLabel}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>{p.category}</span>
                  {scope === 'library' && match && (
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#248a3d' }}>• Applies here</span>
                  )}
                </div>

                {/* Progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '2px' }}>
                  <div style={{ flex: 1, height: '4px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${prog.percentComplete}%`,
                      height: '100%',
                      background: prog.percentComplete === 100 ? '#34c759' : color,
                      borderRadius: '999px',
                      transition: 'width 0.25s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {prog.completedSteps}/{prog.totalSteps - prog.notApplicableSteps}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Protocol detail */}
        {selectedProtocol && progress && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Detail header */}
            <div style={{ ...cardStyle, padding: '18px 20px', borderTop: `3px solid ${PROTOCOL_CATEGORY_COLORS[selectedProtocol.category]}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '10.5px', fontFamily: 'var(--font-mono)', fontWeight: 700,
                      color: PROTOCOL_CATEGORY_COLORS[selectedProtocol.category],
                      background: `${PROTOCOL_CATEGORY_COLORS[selectedProtocol.category]}12`,
                      padding: '2px 8px', borderRadius: '6px'
                    }}>
                      {selectedProtocol.code}
                    </span>
                    <span
                      className="badge"
                      style={{
                        fontSize: '10px',
                        background: PRIORITY_BADGE[selectedProtocol.priority]?.bg,
                        color: PRIORITY_BADGE[selectedProtocol.priority]?.color,
                        border: `1px solid ${PRIORITY_BADGE[selectedProtocol.priority]?.border}`
                      }}
                    >
                      {selectedProtocol.priority}
                    </span>
                    <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                      {selectedProtocol.evidenceGrade}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 0', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                    {selectedProtocol.title}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '6px 0 0' }}>
                    {selectedProtocol.summary}
                  </p>
                </div>

                {/* Compliance ring */}
                <div style={{
                  minWidth: '150px', background: 'var(--bg-secondary)', borderRadius: '12px',
                  padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '5px'
                }}>
                  <div style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Protocol Adherence
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: progress.percentComplete === 100 ? '#248a3d' : PROTOCOL_CATEGORY_COLORS[selectedProtocol.category] }}>
                      {progress.percentComplete}%
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {progress.completedSteps}/{progress.totalSteps - progress.notApplicableSteps} steps
                    </span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${progress.percentComplete}%`, height: '100%',
                      background: progress.percentComplete === 100 ? '#34c759' : PROTOCOL_CATEGORY_COLORS[selectedProtocol.category],
                      borderRadius: '999px', transition: 'width 0.25s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: '10.5px', color: progress.criticalStopsOutstanding > 0 ? '#d70015' : '#248a3d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {progress.criticalStopsOutstanding > 0
                      ? <><AlertTriangle size={11} /> {progress.criticalStopsOutstanding} critical stop{progress.criticalStopsOutstanding > 1 ? 's' : ''} open</>
                      : <><CheckCircle2 size={11} /> All critical stops cleared</>}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Status: <strong style={{ color: 'var(--text-secondary)' }}>{progress.status}</strong>
                  </div>
                </div>
              </div>

              {/* Governance strip */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px',
                marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)'
              }}>
                {[
                  { label: 'Protocol Owner', value: selectedProtocol.owner },
                  { label: 'Version', value: `${selectedProtocol.version} • Effective ${selectedProtocol.effectiveFrom}` },
                  { label: 'Next Review Due', value: selectedProtocol.nextReviewDue },
                  { label: 'Scope', value: `${countProtocolSteps(selectedProtocol)} steps • ${countCriticalStops(selectedProtocol)} critical stops` }
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.45 }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Why this protocol appears for this patient */}
              {(() => {
                const match = matches.find(m => m.protocol.id === selectedProtocol.id);
                if (!match) {
                  return (
                    <div style={{
                      marginTop: '12px', padding: '9px 12px', borderRadius: '10px',
                      background: 'var(--bg-secondary)', fontSize: '11.5px', color: 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center', gap: '7px'
                    }}>
                      <Library size={12} color="#86868b" />
                      Reference protocol — not triggered by {patient.name}'s current case profile.
                    </div>
                  );
                }
                return (
                  <div style={{
                    marginTop: '12px', padding: '9px 12px', borderRadius: '10px',
                    background: 'rgba(0, 113, 227, 0.05)', border: '1px solid rgba(0, 113, 227, 0.15)',
                    display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'
                  }}>
                    <Target size={12} color="#0071e3" />
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#0071e3' }}>
                      Applies to {patient.name}:
                    </span>
                    {match.matchReasons.map((r, i) => (
                      <span key={i} style={{
                        fontSize: '10.5px', color: 'var(--text-secondary)', background: '#ffffff',
                        padding: '2px 8px', borderRadius: '999px', border: '1px solid var(--border-color)'
                      }}>
                        {r}
                      </span>
                    ))}
                  </div>
                );
              })()}

              <div style={{ marginTop: '12px' }}>
                <DataAttributionBadge
                  attribution={compliance?.entryAttribution}
                  currentSurgeon={currentSurgeon}
                  moduleName={`Clinical Protocol ${selectedProtocol.code}`}
                  compact
                />
              </div>
            </div>

            {/* Indications & contraindications */}
            <div style={{ ...cardStyle, padding: '16px 20px' }}>
              {sectionTitle(<Flag size={13} color="#0071e3" />, 'Indications & Applicability')}
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {selectedProtocol.indications.map((ind, i) => (
                  <li key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ind}</li>
                ))}
              </ul>

              {selectedProtocol.contraindications && selectedProtocol.contraindications.length > 0 && (
                <div style={{ marginTop: '12px', padding: '10px 12px', background: 'rgba(255, 149, 0, 0.06)', border: '1px solid rgba(255, 149, 0, 0.2)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#b25000', marginBottom: '5px' }}>
                    Contraindications & Cautions
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {selectedProtocol.contraindications.map((c, i) => (
                      <li key={i} style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Execution phases with checkable steps */}
            {selectedProtocol.phases.map(phase => (
              <div key={phase.id} style={{ ...cardStyle, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <ChevronRight size={14} color={PROTOCOL_CATEGORY_COLORS[selectedProtocol.category]} />
                    <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {phase.title}
                    </h4>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {phase.steps.filter(s => compliance?.completedStepIds.includes(s.id)).length}/{phase.steps.length} done
                  </span>
                </div>

                {phase.description && (
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '0 0 10px', lineHeight: 1.55 }}>
                    {phase.description}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {phase.steps.map(step => {
                    const done = compliance?.completedStepIds.includes(step.id) || false;
                    const na = compliance?.notApplicableStepIds.includes(step.id) || false;

                    return (
                      <div
                        key={step.id}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '10px',
                          padding: '10px 12px', borderRadius: '10px',
                          background: na ? 'var(--bg-secondary)' : done ? 'rgba(52, 199, 89, 0.05)' : '#ffffff',
                          border: `1px solid ${done ? 'rgba(52, 199, 89, 0.25)' : step.criticalStop && !na ? 'rgba(255, 59, 48, 0.22)' : 'var(--border-color)'}`,
                          opacity: na ? 0.6 : 1
                        }}
                      >
                        <button
                          onClick={() => toggleStep(step.id)}
                          title={done ? 'Mark as not done' : 'Mark step as completed'}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, marginTop: '1px', flexShrink: 0 }}
                        >
                          {done
                            ? <CheckCircle2 size={16} color="#34c759" />
                            : <Circle size={16} color={step.criticalStop ? '#d70015' : '#c7c7cc'} />}
                        </button>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap', marginBottom: '3px' }}>
                            <span style={{
                              fontSize: '9.5px', fontWeight: 700, fontFamily: 'var(--font-mono)',
                              color: '#0071e3', background: 'rgba(0, 113, 227, 0.07)',
                              padding: '1px 7px', borderRadius: '5px', display: 'inline-flex', alignItems: 'center', gap: '3px'
                            }}>
                              <Clock size={9} /> {step.timing}
                            </span>
                            {step.criticalStop && (
                              <span style={{
                                fontSize: '9.5px', fontWeight: 700, color: '#d70015',
                                background: 'rgba(255, 59, 48, 0.08)', padding: '1px 7px', borderRadius: '5px',
                                display: 'inline-flex', alignItems: 'center', gap: '3px'
                              }}>
                                <ShieldAlert size={9} /> Critical Stop
                              </span>
                            )}
                            {na && (
                              <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--text-muted)' }}>
                                Not applicable to this case
                              </span>
                            )}
                          </div>

                          <div style={{
                            fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.6,
                            textDecoration: na ? 'line-through' : 'none'
                          }}>
                            {step.action}
                          </div>

                          {step.detail && (
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.55, marginTop: '4px', fontStyle: 'italic' }}>
                              {step.detail}
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <UserCheck size={10} /> {step.responsible}
                            </span>
                            <button
                              onClick={() => toggleNotApplicable(step.id)}
                              style={{
                                border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
                                fontSize: '10.5px', color: na ? '#0071e3' : 'var(--text-muted)',
                                display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500
                              }}
                            >
                              <MinusCircle size={10} /> {na ? 'Restore step' : 'Mark N/A'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Drug specifications */}
            {selectedProtocol.drugSpecs && selectedProtocol.drugSpecs.length > 0 && (
              <div style={{ ...cardStyle, padding: '16px 20px' }}>
                {sectionTitle(<Pill size={13} color="#af52de" />, 'Drug & Dosing Specification')}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', minWidth: '620px' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        {['Drug', 'Dose', 'Route', 'Timing', 'Notes'].map(h => (
                          <th key={h} style={{
                            textAlign: 'left', padding: '7px 10px', fontSize: '10px', fontWeight: 700,
                            color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em'
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProtocol.drugSpecs.map((d, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.drug}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{d.dose}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>{d.route}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>{d.timing}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{d.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Escalation thresholds */}
            {selectedProtocol.thresholds && selectedProtocol.thresholds.length > 0 && (
              <div style={{ ...cardStyle, padding: '16px 20px' }}>
                {sectionTitle(<Gauge size={13} color="#ff9500" />, 'Escalation Thresholds — Trigger to Action')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {selectedProtocol.thresholds.map((t, i) => {
                    const color = SEVERITY_COLOR[t.severity || 'Escalate'];
                    return (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: 'minmax(120px, 0.8fr) minmax(140px, 1fr) 1.4fr',
                        gap: '10px', padding: '9px 12px', borderRadius: '10px',
                        background: 'var(--bg-secondary)', borderLeft: `3px solid ${color}`
                      }}>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.parameter}</div>
                        <div style={{ fontSize: '11.5px', color, fontWeight: 600 }}>{t.trigger}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{t.action}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Red flags */}
            {selectedProtocol.redFlags && selectedProtocol.redFlags.length > 0 && (
              <div style={{
                ...cardStyle, padding: '16px 20px',
                background: 'rgba(255, 59, 48, 0.03)', border: '1px solid rgba(255, 59, 48, 0.18)'
              }}>
                {sectionTitle(<AlertTriangle size={13} color="#d70015" />, 'Red Flags — Immediate Escalation')}
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {selectedProtocol.redFlags.map((flag, i) => (
                    <li key={i} style={{ fontSize: '12px', color: '#7f1d1d', lineHeight: 1.6, fontWeight: 500 }}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Documentation + linked modules */}
            <div style={{ ...cardStyle, padding: '16px 20px' }}>
              {sectionTitle(<FileSignature size={13} color="#0071e3" />, 'Required Documentation')}
              <ul style={{ margin: '0 0 14px', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {selectedProtocol.documentation.map((doc, i) => (
                  <li key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{doc}</li>
                ))}
              </ul>

              {sectionTitle(<Link2 size={13} color="#0071e3" />, 'Document This Protocol In')}
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                {selectedProtocol.linkedModules.map(link => (
                  <button
                    key={link.target + link.label}
                    onClick={() => onNavigateToModule?.(link.target)}
                    style={{
                      fontSize: '11px', padding: '5px 12px', borderRadius: '999px',
                      background: 'rgba(0, 113, 227, 0.06)', border: '1px solid rgba(0, 113, 227, 0.2)',
                      color: '#0071e3', cursor: onNavigateToModule ? 'pointer' : 'default',
                      fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px'
                    }}
                  >
                    <ChevronRight size={11} /> {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Variance documentation */}
            <div style={{ ...cardStyle, padding: '16px 20px' }}>
              {sectionTitle(<FileSignature size={13} color="#b25000" />, 'Protocol Variance Note')}
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.55 }}>
                Where clinical judgement requires departure from this protocol, record the reason here. A documented
                variance is a legitimate clinical decision; an undocumented one is an audit finding.
              </p>
              <VarianceEditor
                key={`${patient.id}-${selectedProtocol.id}`}
                initialNote={compliance?.varianceNote || ''}
                lastUpdatedLabel={compliance
                  ? `Last updated ${compliance.lastUpdatedAt} by ${compliance.lastUpdatedBy}`
                  : 'No protocol activity recorded for this patient yet.'}
                onSave={saveVariance}
              />
            </div>

            {/* Audit metrics + references */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {selectedProtocol.auditMetrics && selectedProtocol.auditMetrics.length > 0 && (
                <div style={{ ...cardStyle, padding: '16px 20px' }}>
                  {sectionTitle(<Gauge size={13} color="#248a3d" />, 'Quality Audit Metrics')}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {selectedProtocol.auditMetrics.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '7px 10px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{m.metric}</span>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#248a3d', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{m.target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ ...cardStyle, padding: '16px 20px' }}>
                {sectionTitle(<BookMarked size={13} color="#af52de" />, 'Evidence Base & References')}
                <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedProtocol.references.map((ref, i) => (
                    <li key={i} style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ref}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface VarianceEditorProps {
  initialNote: string;
  lastUpdatedLabel: string;
  onSave: (note: string) => void;
}

/**
 * Local draft editor for the protocol variance note. Keyed by patient and
 * protocol so switching either starts a clean draft from the saved value.
 */
const VarianceEditor: React.FC<VarianceEditorProps> = ({ initialNote, lastUpdatedLabel, onSave }) => {
  const [draft, setDraft] = useState(initialNote);

  return (
    <>
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="e.g. NSAID restriction waived after consultant discussion — single dose for refractory pain."
        rows={3}
        style={{
          width: '100%', boxSizing: 'border-box', border: '1px solid var(--border-color)',
          borderRadius: '10px', padding: '10px 12px', fontSize: '12px', fontFamily: 'inherit',
          color: 'var(--text-primary)', background: 'var(--bg-secondary)', resize: 'vertical', outline: 'none'
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: '9px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{lastUpdatedLabel}</span>
        <button onClick={() => onSave(draft)} className="btn btn-primary" style={{ fontSize: '11.5px', padding: '6px 16px' }}>
          Save Variance Note
        </button>
      </div>
    </>
  );
};
