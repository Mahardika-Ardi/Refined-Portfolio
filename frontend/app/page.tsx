// src/app/page.tsx

'use client';

import { useEffect, useState } from 'react';

type Phase = 'welcome' | 'choose' | 'done';

export default function WelcomePage() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Jalankan hanya di browser
    const navigationEntries = performance.getEntriesByType(
      'navigation',
    ) as PerformanceNavigationTiming[];

    const navigationType = navigationEntries[0]?.type;

    // Reload → reset intro
    if (navigationType === 'reload') {
      sessionStorage.removeItem('intro-complete');
    }

    const introComplete = sessionStorage.getItem('intro-complete');

    // Kalau intro sudah selesai
    if (introComplete) {
      setPhase('done');
      return;
    }

    let active = true;

    const startSequence = async () => {
      await wait(1500);

      if (!active) return;
      setVisible(false);

      await wait(500);

      if (!active) return;

      setPhase('choose');
      setVisible(true);

      await wait(1500);

      if (!active) return;

      setVisible(false);

      await wait(500);

      if (!active) return;

      sessionStorage.setItem('intro-complete', 'true');

      setPhase('done');
    };

    startSequence();

    return () => {
      active = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex items-center justify-center h-screen">
      {phase === 'done' ? (
        <h1 className="text-4xl font-bold">Home page here</h1>
      ) : (
        <h1
          className={`
            text-4xl font-bold
            transition-opacity duration-500
            ${visible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {phase === 'welcome'
            ? 'Welcome to my Portfolio'
            : 'Choose your experience'}
        </h1>
      )}
    </main>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
