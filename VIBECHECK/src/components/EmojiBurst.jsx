import { useEffect, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

const EMOJIS = ['✨', '🌟', '🎉', '💖', '🌈', '🎭', '🔮', '💫', '🌸', '🎈'];

function createParticles() {
  const particleCount = 18;

  return Array.from({ length: particleCount }).map((_, i) => {
    const angle = (i * 360) / particleCount + (Math.random() * 20 - 10);
    const rad = (angle * Math.PI) / 180;
    const distance = 80 + Math.random() * 90;

    return {
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      style: {
        '--tx': `${Math.round(Math.cos(rad) * distance)}px`,
        '--ty': `${Math.round(Math.sin(rad) * distance - 30)}px`,
        '--rot': `${Math.round(Math.random() * 180 - 90)}deg`,
        '--scale': (0.7 + Math.random() * 0.7).toFixed(2),
        animationDelay: `${Math.round(Math.random() * 120)}ms`
      }
    };
  });
}

export default function EmojiBurst() {
  const reducedMotion = useReducedMotion();
  const [particles] = useState(createParticles);
  const [active, setActive] = useState(!reducedMotion);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const timer = setTimeout(() => {
      setActive(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [reducedMotion]);

  if (!active) return null;

  return (
    <div className="emoji-burst-container" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="emoji-particle"
          style={particle.style}
        >
          {particle.emoji}
        </span>
      ))}
    </div>
  );
}
