'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const PortfolioApp = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-label="Loading portfolio experience"
      className="fixed inset-0 z-[99999] bg-[#050303] flex items-center justify-center select-none overflow-hidden"
    />
  ),
});

export default function HomePage() {
  return <PortfolioApp />;
}
