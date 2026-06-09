import { useState, useEffect } from 'react';

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
    <div className="glass-panel scanner-card fade-in">
      <div className="scanner-container">
        {/* Outer glowing pulsing orb */}
        <div className="aura-glow-orb"></div>
        {/* Rotating ring */}
        <div className="scanner-ring"></div>
        <div className="scanner-inner-eye">✨</div>
      </div>
      <h3 className="scanner-heading">Scanning Aura</h3>
      <div className="scanner-message-box">
        <p className="scanner-message text-reveal" key={messageIndex}>
          {SCAN_MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  );
}
