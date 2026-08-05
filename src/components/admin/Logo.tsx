import React from 'react'

export const Logo: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/brand/vmk-logo.png"
      alt="VMK logó"
      style={{ maxWidth: '220px', height: 'auto' }}
    />
    <span
      style={{
        fontSize: '13px',
        color: '#666',
        fontFamily: 'system-ui, sans-serif',
        letterSpacing: '0.02em',
      }}
    >
      Tartalomkezelő rendszer
    </span>
  </div>
)
