'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import anime from 'animejs';
import WelcomeHeader from '@/components/WelcomeHeader';

export default function Welcome() {
  const router   = useRouter();
  const panelRef = useRef(null);
  const ctaRef   = useRef(null);

  useEffect(() => {

    anime.timeline({ easing: 'easeOutQuart' })

      .add({
        targets: panelRef.current,
        opacity: [0, 1],
        scale:   [0.94, 1],
        duration: 700,
      })
   
      .add({
        targets: '.welcome__panel .hero-line',
        opacity:   [0, 1],
        translateY:[20, 0],
        duration:  450,
        delay: anime.stagger(60),
      }, '-=400')
     
      .add({
        targets: ctaRef.current,
        opacity:   [0, 1],
        translateY:[-10, 0],
        duration: 500,
      }, '-=300');


    const handleEnter = (e) => {
      if (e.key === 'Enter') router.push('/editor');
    };
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, [router]);

  return (
    <main className="welcome">
      <div ref={panelRef} className="welcome__panel">
        <WelcomeHeader />

        <Link
          ref={ctaRef}
          href="/editor"
          className="welcome__cta"
          aria-label="Enter editor"
        >
          <span className="cta__label">Launch Sequencer</span>
          <span className="cta__arrow">⟶</span>
        </Link>
      </div>
    </main>
  );
}
