import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Wifi, Copy, Check, X, Smartphone, Laptop, Tablet, ShieldCheck } from 'lucide-react';

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkInfo: {
    ip: string;
    clientPort: number;
    clientUrl: string;
    networkName?: string;
  };
}

export const NetworkModal: React.FC<NetworkModalProps> = ({ isOpen, onClose, networkInfo }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(networkInfo.clientUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '28px',
        position: 'relative',
        background: '#ffffff',
        borderRadius: '18px',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f5f5f7',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '7px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s ease'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div style={{
            background: 'rgba(0, 113, 227, 0.08)',
            padding: '12px',
            borderRadius: '14px',
            color: '#0071e3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wifi size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1d1d1f', margin: 0, letterSpacing: '-0.015em' }}>
              WiFi Multi-Surgeon Testing
            </h2>
            <p style={{ fontSize: '13px', color: '#6e6e73', margin: '3px 0 0 0' }}>
              Connect iPads, iPhones, and workstations on this local network
            </p>
          </div>
        </div>

        {/* QR Code Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#f5f5f7',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(0, 0, 0, 0.04)'
          }}>
            <QRCodeSVG
              value={networkInfo.clientUrl}
              size={180}
              level="M"
              includeMargin={false}
            />
          </div>
          <span style={{ fontSize: '12px', color: '#6e6e73', marginTop: '12px', textAlign: 'center', fontWeight: 400 }}>
            Point your iPad or iPhone camera at this QR code while on the same WiFi
          </span>
        </div>

        {/* Direct Link Box */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6e6e73', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Direct Browser Link for Operating Rooms:
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f5f5f7',
            borderRadius: '10px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '4px 6px 4px 12px'
          }}>
            <code style={{
              fontFamily: 'SF Mono, Menlo, Monaco, monospace',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0071e3',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {networkInfo.clientUrl}
            </code>
            <button
              onClick={handleCopy}
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              {copied ? <Check size={14} color="#ffffff" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'rgba(0, 113, 227, 0.04)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '12px',
          color: '#515154',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          border: '1px solid rgba(0, 113, 227, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d1d1f', fontWeight: 600 }}>
            <ShieldCheck size={16} color="#0071e3" />
            <span>Encrypted Shared Spine Surgical Database</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Tablet size={14} color="#0071e3" /> <span>Ward Rounds iPad</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Laptop size={14} color="#0071e3" /> <span>OR Workstation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Smartphone size={14} color="#0071e3" /> <span>Mobile OT Note</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
