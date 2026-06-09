import { useState, useEffect } from 'react';
import MotionReveal from './Motion';

const SCAN_MESSAGES = [
  "Reading aura frequencies... 📡",
  "Aligning cozy matrix... 🍵",
  "Extracting positive traits... ✨",
  "Calibrating vibe signature... 🎭"
];

export default function AuraScanner({ onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle through messages every 600ms
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev < SCAN_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 600);

    // Complete the scanning cycle after 2.5s (2500ms)
    const completionTimeout = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(completionTimeout);
    };
  }, [onComplete]);

  return (
    <MotionReveal className="glass-panel scanner-card" variant="bounce">
      <MotionReveal className="scanner-container" delay={80} variant="pop">
        {/* Outer glowing pulsing orb */}
        <div className="aura-glow-orb"></div>
        {/* Rotating ring */}
        <div className="scanner-ring"></div>
        <div className="scanner-inner-eye">✨</div>
      </MotionReveal>
      <MotionReveal as="h3" className="scanner-heading" delay={160}>Scanning Aura</MotionReveal>
      <MotionReveal className="scanner-progress" delay={210} aria-hidden="true">
        <span className="scanner-progress-fill"></span>
      </MotionReveal>
      <MotionReveal className="scanner-message-box" delay={250}>
        <p className="scanner-message text-reveal" key={messageIndex}>
          {SCAN_MESSAGES[messageIndex]}
        </p>
      </MotionReveal>
    </MotionReveal>
  );
}
