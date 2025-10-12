'use client';
import React from 'react';
export default function AdSlot({ id='default', className='' }) {
  return (
    <div aria-label={`Ad slot ${id}`} className={`border rounded-md p-4 text-sm opacity-80 ${className}`}>
      <div className="font-semibold">Sponsored</div>
      <div>Replace with your ad network tag or house promo.</div>
    </div>
  );
}
