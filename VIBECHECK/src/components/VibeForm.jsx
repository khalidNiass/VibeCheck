import { useState, useEffect, useRef } from 'react';
import MotionReveal from './Motion';
import { validateName } from '../utils/vibeGenerator';

export default function VibeForm({ onSubmit, initialName = '' }) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const mountedAt = useRef(0);

  // Autofocus the input on mount
  useEffect(() => {
    mountedAt.current = Date.now();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateName(name);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    setError('');
    onSubmit(validation.value, {
      hadEmoji: /[\u{1f300}-\u{1faff}\u{2600}-\u{27bf}]/u.test(validation.value),
      inputLength: validation.value.length,
      interactionMs: Date.now() - mountedAt.current,
      isMobile: window.matchMedia('(max-width: 640px)').matches || navigator.maxTouchPoints > 0
    });
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setError('');
    }
  };

  return (
    <MotionReveal className="glass-panel form-card" variant="bounce">
      <MotionReveal className="landing-banner-frame" delay={40} variant="pop">
        <img src="/banner.png" alt="VibeCheck preview banner" className="landing-banner-image" />
      </MotionReveal>
      <MotionReveal as="h2" className="form-title" delay={80}>What's your vibe?</MotionReveal>
      <MotionReveal as="p" className="form-description" delay={140}>
        Discover how your aura feels to others. Get one of 5,000 possible positive vibe reports in seconds!
      </MotionReveal>

      <form onSubmit={handleSubmit} noValidate>
        <MotionReveal className="input-group" delay={200}>
          <label htmlFor="userName" className="sr-only">Your Name</label>
          <input
            ref={inputRef}
            id="userName"
            type="text"
            placeholder="Type your name here..."
            value={name}
            onChange={handleInputChange}
            maxLength={20}
            required
            autoComplete="off"
            className={error ? 'input-error' : ''}
          />
          {error && <p className="error-message motion-shake" role="alert">{error}</p>}
        </MotionReveal>

        <MotionReveal as="button" type="submit" className="btn btn-primary btn-submit" delay={260} variant="pop">
          Check My Vibe ✨
        </MotionReveal>
      </form>

      <MotionReveal className="form-badge-row" delay={340}>
        <span className="form-badge">🔒 Private & Secure</span>
        <span className="form-badge">✨ 100% Positive Only</span>
      </MotionReveal>
    </MotionReveal>
  );
}
