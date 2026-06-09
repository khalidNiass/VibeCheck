import { useState, useEffect, useRef } from 'react';
import MotionReveal from './Motion';

export default function VibeForm({ onSubmit, initialName = '' }) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Autofocus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter your name first!');
      return;
    }
    setError('');
    onSubmit(cleanName);
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setError('');
    }
  };

  return (
    <MotionReveal className="glass-panel form-card" variant="bounce">
      <MotionReveal as="h2" className="form-title" delay={80}>What's your vibe?</MotionReveal>
      <MotionReveal as="p" className="form-description" delay={140}>
        Discover how your aura feels to others. Get a positive, personalized vibe report in seconds!
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
            maxLength={30}
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
