import { useEffect, useRef, useState } from 'react';
import EmojiBurst from './EmojiBurst';
import MotionReveal from './Motion';

export default function VibeCard({ vibe, onReset, isShared = false }) {
  const [toastMessage, setToastMessage] = useState('');
  const [shareCelebrating, setShareCelebrating] = useState(false);
  const [shareRewardVisible, setShareRewardVisible] = useState(false);
  const shareTimers = useRef([]);

  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (isShared) return true;
    try {
      return sessionStorage.getItem(`vibecheck_unlocked_${vibe.name}_${vibe.shareVariant}`) === 'true';
    } catch {
      return false;
    }
  });
  const [showUnlockBadge, setShowUnlockBadge] = useState(false);

  useEffect(() => {
    return () => {
      shareTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  // Construct sharing URL
  const getShareUrl = () => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      name: vibe.name,
      v: vibe.shareVariant
    });
    return `${base}?${params.toString()}`;
  };

  const handleCopyLink = async () => {
    const shareUrl = getShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setToastMessage('Secret vibe link copied to clipboard! 🔗');
      setTimeout(() => setToastMessage(''), 2500);
    } catch {
      setToastMessage('Could not copy link automatically. Please copy the URL.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const getWhatsAppShareUrl = () => {
    const shareUrl = getShareUrl();
    const text = vibe.shareText || `I just got my VibeCheck 😄\n\n${vibe.emoji} ${vibe.archetypeTitle}\n"${vibe.description}"\n\nWhat vibe do you get? 👀`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + shareUrl)}`;
  };

  const handleWhatsAppShare = () => {
    shareTimers.current.forEach((timer) => clearTimeout(timer));
    
    // Instantly unlock and celebrate
    setIsUnlocked(true);
    setShowUnlockBadge(true);
    setShareCelebrating(true);
    setShareRewardVisible(true);

    try {
      sessionStorage.setItem(`vibecheck_unlocked_${vibe.name}_${vibe.shareVariant}`, 'true');
    } catch (e) {
      console.warn('sessionStorage is not accessible', e);
    }

    shareTimers.current = [
      setTimeout(() => setShareCelebrating(false), 2500),
      setTimeout(() => setShareRewardVisible(false), 5200),
      setTimeout(() => setShowUnlockBadge(false), 4000)
    ];
  };

  return (
    <div className="vibe-card-container">
      <EmojiBurst />
      {shareCelebrating && (
        <EmojiBurst key="unlock-celebration-burst" />
      )}
      {shareCelebrating && (
        <div className="share-celebration-layer" aria-hidden="true">
          <span className="share-float-icon">💬</span>
          <span className="share-float-icon">🎉</span>
          <span className="share-float-icon">✨</span>
          <span className="share-float-icon">💚</span>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <MotionReveal className="toast-notification" role="alert" variant="pop">
          {toastMessage}
        </MotionReveal>
      )}

      {/* Shared Welcome Banner */}
      {isShared && (
        <MotionReveal className="shared-banner" variant="bounce">
          <span className="banner-wave">👋</span>
          <p className="banner-text">
            <strong>{vibe.name}</strong> shared their VibeCheck profile with you!
          </p>
        </MotionReveal>
      )}

      {/* Main Glassmorphic Vibe Card */}
      <MotionReveal className={`glass-panel vibe-card result-reveal ${vibe.themeClass}`} variant="result">
        {/* Glow backdrop inside the card */}
        <div className="card-aura-glow"></div>
        <img className="result-card-logo" src="/logo.png" alt="" aria-hidden="true" />

        <MotionReveal className="card-header" delay={160}>
          <span className="profile-label">AURA SIGNATURE</span>
          <h2 className="profile-name">{vibe.name}</h2>
        </MotionReveal>

        <MotionReveal className="archetype-badge float-anim" delay={240} variant="pop">
          <span className="archetype-emoji">{vibe.emoji}</span>
          <h3 className="archetype-title">{vibe.archetypeTitle}</h3>
        </MotionReveal>

        <MotionReveal className="vibe-divider" delay={300}></MotionReveal>

        <MotionReveal className="vibe-description-wrapper" delay={360}>
          <p className={`vibe-description ${(!isUnlocked && !isShared) ? 'is-gated' : ''}`}>
            "{vibe.description}"
          </p>
          {!isUnlocked && !isShared && (
            <div className="vibe-description-overlay">
              <span className="lock-icon" aria-hidden="true">✨</span>
              <span className="lock-text">Share your vibe to unlock the full message ✨</span>
            </div>
          )}
          {isUnlocked && showUnlockBadge && !isShared && (
            <div className="vibe-description-unlocked-badge">
              Unlocked 🎉
            </div>
          )}
        </MotionReveal>

        <MotionReveal className="stats-section" delay={430} inView>
          {Object.entries(vibe.stats).map(([statName, val]) => (
            <div className="stat-row" key={statName}>
              <div className="stat-info">
                <span className="stat-name">{statName}</span>
                <span className="stat-value">{val}%</span>
              </div>
              <div className="stat-bar-container">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${val}%` }}
                ></div>
              </div>
            </div>
          ))}
        </MotionReveal>

        <MotionReveal className="mascot-badge" delay={500} variant="pop">
          <span className="mascot-emoji">{vibe.mascotEmoji}</span>
          <span className="mascot-text">
            Spirit Charm: <strong>{vibe.mascotText}</strong>
          </span>
        </MotionReveal>
      </MotionReveal>

      {/* Sharing and Action Buttons */}
      <MotionReveal className="action-area" delay={580} inView>
        {shareRewardVisible && (
          <MotionReveal className="share-reward-message" variant="bounce" role="status">
            <strong>Shared! 🎉</strong>
            <span>Let's see what your friends get 😄</span>
            <small>Your friends are going to love this 😎</small>
          </MotionReveal>
        )}

        {isShared ? (
          <>
            <button onClick={onReset} className="btn btn-primary btn-cta">
              Check My Vibe 🎭
            </button>
            <div className="share-section-card">
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-whatsapp btn-share-magnet ${shareCelebrating ? 'is-sharing' : ''}`}
                onClick={handleWhatsAppShare}
              >
                <span className="whatsapp-button-icon">💬</span>
                <span>Share {vibe.name}'s Vibe</span>
              </a>
              <button onClick={handleCopyLink} className="btn btn-secondary">
                Copy Link
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="share-section-card">
              <div className="sharing-headline">✨ Spread the Good Vibes! ✨</div>
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-whatsapp btn-share-magnet ${(!isUnlocked && !isShared) ? 'pulse-glow' : ''} ${shareCelebrating ? 'is-sharing' : ''}`}
                onClick={handleWhatsAppShare}
              >
                <span className="whatsapp-button-icon">💬</span>
                <span>Share on WhatsApp</span>
              </a>
              <button onClick={handleCopyLink} className="btn btn-secondary">
                Copy Vibe Link 🔗
              </button>
            </div>
            <button onClick={onReset} className="btn btn-secondary btn-reset">
              Check Another Vibe 🔄
            </button>
          </>
        )}
      </MotionReveal>
    </div>
  );
}
