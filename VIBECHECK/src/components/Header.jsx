
import MotionReveal from './Motion';

export default function Header() {
  return (
    <MotionReveal as="header" className="vibe-header" variant="pop">
      <div className="logo-container">
        <span className="logo-emoji">🎭</span>
        <span className="logo-text">VibeCheck</span>
        <span className="pulse-indicator"></span>
      </div>
      <p className="logo-subtitle">Positive Energy Signature Reader</p>
    </MotionReveal>
  );
}
