import React from 'react';
import { Patient } from '../types/spine';
import { ProtocolModuleTarget } from '../types/protocol';
import {
  matchProtocolsToPatient,
  getProtocolByCode,
  getPatientProtocolCompliance,
  computeProtocolProgress
} from '../data/clinicalProtocols';
import { BookOpenCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ProtocolLinkStripProps {
  patient: Patient;
  /** Surfaces every patient-applicable protocol that documents into this module. */
  moduleTarget: ProtocolModuleTarget;
  /** Protocol codes always pinned first, whether or not the matcher selected them. */
  pinnedCodes?: string[];
  onOpenProtocol?: (protocolId: string) => void;
  maxItems?: number;
}

/**
 * Compact strip of governing clinical protocols, rendered inside the clinical
 * modules so the protocol that governs a task is one click from the task.
 */
export const ProtocolLinkStrip: React.FC<ProtocolLinkStripProps> = ({
  patient,
  moduleTarget,
  pinnedCodes = [],
  onOpenProtocol,
  maxItems = 4
}) => {
  const applicable = matchProtocolsToPatient(patient)
    .map(m => m.protocol)
    .filter(p => p.linkedModules.some(l => l.target === moduleTarget));

  const pinned = pinnedCodes
    .map(code => getProtocolByCode(code))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const seen = new Set<string>();
  const protocols = [...pinned, ...applicable]
    .filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    })
    .slice(0, maxItems);

  if (protocols.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
      padding: '9px 12px',
      background: 'rgba(0, 113, 227, 0.04)',
      border: '1px solid rgba(0, 113, 227, 0.14)',
      borderRadius: '12px'
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10.5px', fontWeight: 700, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        <BookOpenCheck size={12} /> Governing Protocols
      </span>

      {protocols.map(p => {
        const progress = computeProtocolProgress(p, getPatientProtocolCompliance(patient, p.id));
        const isEmergency = p.priority === 'Emergency Response';

        return (
          <button
            key={p.id}
            onClick={() => onOpenProtocol?.(p.id)}
            title={`${p.code} — ${p.title}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              padding: '4px 11px',
              borderRadius: '999px',
              background: '#ffffff',
              border: `1px solid ${isEmergency ? 'rgba(255, 59, 48, 0.25)' : 'var(--border-color)'}`,
              color: 'var(--text-primary)',
              cursor: onOpenProtocol ? 'pointer' : 'default',
              fontWeight: 500
            }}
          >
            {isEmergency
              ? <ShieldAlert size={11} color="#d70015" />
              : progress.percentComplete === 100
                ? <CheckCircle2 size={11} color="#34c759" />
                : <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0071e3', display: 'inline-block' }} />}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, color: 'var(--text-muted)' }}>
              {p.code}
            </span>
            <span>{p.shortLabel}</span>
            <span style={{
              fontSize: '9.5px',
              fontWeight: 700,
              color: progress.percentComplete === 100 ? '#248a3d' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)'
            }}>
              {progress.percentComplete}%
            </span>
          </button>
        );
      })}
    </div>
  );
};
