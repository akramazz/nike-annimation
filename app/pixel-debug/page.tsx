'use client';

import { useEffect, useState, useCallback } from 'react';
import { pageview, event } from '@/lib/facebookPixel';

export default function PixelDebug() {
  const [fbqAvailable, setFbqAvailable] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Check if fbq is available on load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq && typeof window.fbq === 'function') {
      setFbqAvailable(true);
      addLog('fbq disponible ✅');
    } else {
      setFbqAvailable(false);
      addLog('fbq non disponible ❌');
    }
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const testPageView = useCallback(() => {
    if (!fbqAvailable) {
      addLog('Cannot test PageView: fbq not available');
      return;
    }
    try {
      pageview();
      addLog('PageView event sent ✅');
    } catch (error) {
      addLog(`Error sending PageView: ${error}`);
    }
  }, [fbqAvailable]);

  const testAddToCart = useCallback(() => {
    if (!fbqAvailable) {
      addLog('Cannot test AddToCart: fbq not available');
      return;
    }
    try {
      event('AddToCart', {
        content_name: 'Premium Jacket Test',
        value: 99.99,
        currency: 'EUR'
      });
      addLog('AddToCart event sent ✅');
    } catch (error) {
      addLog(`Error sending AddToCart: ${error}`);
    }
  }, [fbqAvailable]);

  const testPurchase = useCallback(() => {
    if (!fbqAvailable) {
      addLog('Cannot test Purchase: fbq not available');
      return;
    }
    try {
      event('Purchase', {
        value: 199.99,
        currency: 'EUR'
      });
      addLog('Purchase event sent ✅');
    } catch (error) {
      addLog(`Error sending Purchase: ${error}`);
    }
  }, [fbqAvailable]);

  // Auto-scroll to bottom of logs when logs change
  useEffect(() => {
    const logContainer = document.querySelector('.log-container');
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Meta Pixel Debugger</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Statut du Pixel</h2>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded" 
                style={{ backgroundColor: fbqAvailable ? '#10b981' : '#ef4444' }}></span>
          <span>fbq disponible : {fbqAvailable ? '✅' : '❌'}</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Tests</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            onClick={testPageView}
            disabled={!fbqAvailable}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            Test PageView
          </button>
          <button
            onClick={testAddToCart}
            disabled={!fbqAvailable}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            Test AddToCart
          </button>
          <button
            onClick={testPurchase}
            disabled={!fbqAvailable}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            Test Purchase
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Logs en temps réel</h2>
        <div className="h-96 overflow-auto bg-gray-800 p-4 rounded log-container">
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}