'use client';
import React from 'react';
export default function PaywallGate({ featureId, children }) {
  const [unlocked, setUnlocked] = React.useState(false);
  React.useEffect(() => {
    const key = `entitlement:${featureId}`;
    setUnlocked(typeof window !== 'undefined' && localStorage.getItem(key) === '1');
  }, [featureId]);
  if (unlocked) return children;
  return (
    <div className="border rounded-lg p-4">
      <div className="font-semibold mb-2">Premium Mode</div>
      <p className="mb-3">Unlock harder modes, global leaderboards, and events.</p>
      <button
        onClick={() => { localStorage.setItem(`entitlement:${featureId}`, '1'); location.reload(); }}
        className="px-3 py-2 rounded-md border"
      >Simulate Purchase (Dev)</button>
    </div>
  );
}
