
import MotionReveal from './Motion';

export default function Header() {
  return (
    <MotionReveal as="header" className="vibe-header" variant="pop">
      <div className="logo-container">
        <img className="brand-logo-mark" src="/logo.png" alt="" aria-hidden="true" />
        <span className="logo-text">VibeCheck</span>
        <span className="pulse-indicator"></span>
      </div>
      <p className="logo-subtitle">Positive Energy Signature Reader</p>
    </MotionReveal>
  );
}
