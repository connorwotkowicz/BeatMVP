'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WelcomeHeader from '@/components/WelcomeHeader';

export default function Welcome() {
  const router = useRouter();
  const [animateIn, setAnimateIn] = useState(true);

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === 'Enter') {
        router.push('/editor');
      }
    };

    window.addEventListener('keydown', handleEnter);
    const timer = setTimeout(() => setAnimateIn(false), 800);

    return () => {
      window.removeEventListener('keydown', handleEnter);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className={`welcome-page ${animateIn ? 'disney-animate-in' : ''}`}>
      <WelcomeHeader />
      <div className="continue-button-container">
        <div className="continue-button">
          <Link href="/editor">⟶</Link>
        </div>
      </div>
    </div>
  );
}
