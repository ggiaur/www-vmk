'use client'

import React from 'react'

export const DashboardBanner: React.FC = () => (
  <div
    style={{
      background: 'linear-gradient(135deg, #00909b 0%, #159097 100%)',
      color: '#fff',
      borderRadius: '8px',
      padding: '24px 32px',
      marginBottom: '24px',
      fontFamily: 'system-ui, sans-serif',
    }}
  >
    <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600 }}>
      Vörösmarty Mihály Könyvtár
    </h2>
    <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
      Tartalomkezelő rendszer &mdash; Hírek, események, galériák, nyitvatartás és egyéb tartalmak
      szerkesztése.
    </p>
  </div>
)
