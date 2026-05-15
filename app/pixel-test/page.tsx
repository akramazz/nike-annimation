'use client';

import { useRouter } from 'next/navigation';

export default function PixelTestPage() {
  const router = useRouter();

  const handlePageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      alert('PageView event sent!');
    } else {
      alert('FBQ not loaded yet');
    }
  };

  const handleAddToCart = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart');
      alert('AddToCart event sent!');
    } else {
      alert('FBQ not loaded yet');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Meta Pixel Test</h1>
      <div className="space-y-4">
        <button
          onClick={handlePageView}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Trigger PageView
        </button>
        <button
          onClick={handleAddToCart}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Trigger AddToCart
        </button>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}