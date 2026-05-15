'use client';

import React, { useState } from 'react';
import { pageview, event } from '@/lib/facebookPixel';

type LogEntry = {
  time: string;
  message: string;
};

export default function PixelDebugPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [fbqDetected, setFbqDetected] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      { time: new Date().toLocaleTimeString(), message },
    ]);
  };

  const checkFbq = () => {
    const detected = typeof window !== 'undefined' && !!window.fbq;
    setFbqDetected(detected);
  };

  const handlePageView = () => {
    try {
      pageview();
      addLog('✅ PageView fired successfully');
    } catch (err) {
      addLog(`❌ PageView error: ${err}`);
    }
  };

  const handleAddToCart = () => {
    try {
      event('AddToCart', { content_name: 'Test', value: 100, currency: 'DZD' });
      addLog('✅ AddToCart event fired successfully');
    } catch (err) {
      addLog(`❌ AddToCart error: ${err}`);
    }
  };

  const handlePurchase = () => {
    try {
      event('Purchase', { value: 200, currency: 'DZD' });
      addLog('✅ Purchase event fired successfully');
    } catch (err) {
      addLog(`❌ Purchase error: ${err}`);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Meta Pixel Debug</h1>

      {/* Statut fbq */}
      <section style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={checkFbq}
          style={{
            padding: '0.5rem 1rem',
            background: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          🔍 Vérifier fbq
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}>
          fbq détecté :&nbsp;
          <strong>{fbqDetected ? '✅ Oui' : '❌ Non'}</strong>
        </p>
      </section>

      {/* Boutons de test */}
      <section style={{ marginBottom: '2rem' }}>
        <button
          onClick={handlePageView}
          style={{
            marginRight: '0.75rem',
            marginBottom: '0.75rem',
            padding: '0.6rem 1.2rem',
            background: '#1877f2',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          📄 Test PageView
        </button>
        <button
          onClick={handleAddToCart}
          style={{
            marginRight: '0.75rem',
            marginBottom: '0.75rem',
            padding: '0.6rem 1.2rem',
            background: '#ff6b00',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          🛒 Test AddToCart
        </button>
        <button
          onClick={handlePurchase}
          style={{
            padding: '0.6rem 1.2rem',
            background: '#42b72a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          💳 Test Purchase
        </button>
      </section>

      {/* Logs en temps réel */}
      <section>
        <h2>Logs</h2>
        <div
          style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '1rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {logs.length === 0 && (
            <p style={{ color: '#888' }}>Aucun log pour le moment.</p>
          )}
          {logs.map((entry, index) => (
            <p key={index} style={{ margin: '0.25rem 0', color: '#fff' }}>
              [{entry.time}] {entry.message}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
