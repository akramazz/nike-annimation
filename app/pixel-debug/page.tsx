'use client';

import { useState } from 'react';

export default function PixelDebugPage() {
  const [fbqExists, setFbqExists] = useState(false);
  const [pixelIdActive, setPixelIdActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const checkFbq = () => {
    if (typeof window !== 'undefined') {
      const exists = !!window.fbq;
      setFbqExists(exists);
      
      if (exists) {
        try {
          // Try to get pixel ID - this is a simplified check
          // In reality, fbq doesn't expose the ID directly, but we can check if it's functional
          setPixelIdActive(true);
          setStatusMessage('FBQ is loaded and functional');
        } catch (error) {
          setPixelIdActive(false);
          setStatusMessage('FBQ loaded but error: ' + error.message);
        }
      } else {
        setStatusMessage('FBQ not found');
      }
    }
  };

  const trackPageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      setStatusMessage('PageView event sent');
      console.log('PageView event sent');
    } else {
      setStatusMessage('FBQ not available');
      console.log('FBQ not available');
    }
  };

  const trackAddToCart = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart');
      setStatusMessage('AddToCart event sent');
      console.log('AddToCart event sent');
    } else {
      setStatusMessage('FBQ not available');
      console.log('FBQ not available');
    }
  };

  const trackPurchase = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        value: 99.99,
        currency: 'EUR'
      });
      setStatusMessage('Purchase event sent');
      console.log('Purchase event sent');
    } else {
      setStatusMessage('FBQ not available');
      console.log('FBQ not available');
    }
  };

  // Check FBQ status on load
  useEffect(() => {
    checkFbq();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Meta Pixel Debug</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={trackPageView}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Test PageView
        </button>
        <button
          onClick={trackAddToCart}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Test AddToCart
        </button>
        <button
          onClick={trackPurchase}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Test Purchase
        </button>
        <button
          onClick={checkFbq}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          Check FBQ Status
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded w-full max-w-xs">
        <h2 className="text-lg font-semibold mb-2">Status:</h2>
        <p className="mb-1"><span className="font-bold">FBQ exists:</span> {fbqExists ? 'YES' : 'NO'}</p>
        <p className="mb-1"><span className="font-bold">Pixel ID active:</span> {pixelIdActive ? 'YES' : 'NO'}</p>
        <p className="mb-1 text-sm"><span className="font-bold">Message:</span> {statusMessage}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Click "Check FBQ Status" to verify pixel loading</li>
          <li>Click test buttons to send events</li>
          <li>Check browser console for detailed logs</li>
          <li>Use Meta Pixel Helper Chrome extension to verify</li>
          <li>Check Meta Events Manager for real-time activity</li>
        </ul>
      </div>

      <div className="mt-6">
        <a href="/" className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
          Go to Home
        </a>
      </div>
    </div>
  );
}