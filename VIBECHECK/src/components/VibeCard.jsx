import { useEffect, useRef, useState } from 'react';
import EmojiBurst from './EmojiBurst';
import MotionReveal from './Motion';

export default function VibeCard({ vibe, onReset, isShared = false }) {
  const [toastMessage, setToastMessage] = useState('');
  const [shareCelebrating, setShareCelebrating] = useState(false);
  const [shareRewardVisible, setShareRewardVisible] = useState(false);
  const [shareSheetVisible, setShareSheetVisible] = useState(false);
  const [shareSheetDismissed, setShareSheetDismissed] = useState(false);
  const [shareSheetClosing, setShareSheetClosing] = useState(false);
  const shareTimers = useRef([]);

  useEffect(() => {
    return () => {
      shareTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (isShared || shareSheetDismissed) return undefined;

    const timer = setTimeout(() => {
      setShareSheetClosing(false);
      setShareSheetVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isShared, shareSheetDismissed, vibe.name]);

  // Construct sharing URL
  const getShareUrl = () => {
    const base = window.location.origin + window.location.pathname;
    return `${base}?name=${encodeURIComponent(vibe.name)}`;
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
    const text = `🎭 I just ran a VibeCheck! My vibe signature is:
    
✨ ${vibe.archetypeTitle.toUpperCase()} ${vibe.emoji}
"${vibe.description}"

Check what your vibe is here! 👇`;
    
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + shareUrl)}`;
  };

  const handleWhatsAppShare = () => {
    shareTimers.current.forEach((timer) => clearTimeout(timer));
    setShareCelebrating(true);
    setShareRewardVisible(true);
    setShareSheetVisible(true);
    setShareSheetClosing(false);

    shareTimers.current = [
      setTimeout(() => setShareCelebrating(false), 900),
      setTimeout(() => setShareRewardVisible(false), 5200)
    ];
  };

  const handleDismissShareSheet = () => {
    setShareSheetDismissed(true);
    setShareSheetClosing(true);
    shareTimers.current = [
      ...shareTimers.current,
      setTimeout(() => {
        setShareSheetVisible(false);
        setShareSheetClosing(false);
      }, 260)
    ];
  };

  return (
    <div className="vibe-card-container">
      <EmojiBurst />
      {shareCelebrating && (
        <div className="share-celebration-layer" aria-hidden="true">
          <span className="share-float-icon">💬</span>
          <span className="share-float-icon">🎉</span>
          <span className="share-float-icon">✨</span>
          <span className="share-float-icon">💚</span>
        </div>
      )}

      {!isShared && (shareSheetVisible || shareSheetClosing) && (
        <div className={`share-sheet-backdrop ${shareCelebrating ? 'is-sharing' : ''} ${shareSheetClosing ? 'is-closing' : ''}`}>
          <div className={`share-sheet ${shareCelebrating ? 'is-sharing' : ''} ${shareSheetClosing ? 'is-closing' : ''}`} role="region" aria-label="Share your VibeCheck result">
            <button
              type="button"
              className="share-sheet-close"
              onClick={handleDismissShareSheet}
              aria-label="Close share prompt"
            >
              ×
            </button>

            {shareRewardVisible ? (
              <div className="share-sheet-success" role="status">
                <span className="share-sheet-success-icon">🎉</span>
                <strong>Shared!</strong>
                <span>Let's see what your friends get 👀</span>
              </div>
            ) : (
              <>
                <div className="share-sheet-kicker">Ta-da 🎉</div>
                <h3 className="share-sheet-title">This result is share-worthy 😄</h3>
                <p className="share-sheet-copy">Send it to your friends and see what vibe they get.</p>
              </>
            )}

            <a
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-whatsapp share-sheet-button ${shareCelebrating ? 'is-sharing' : ''}`}
              onClick={handleWhatsAppShare}
            >
              <span className="whatsapp-button-icon">💬</span>
              <span>Share on WhatsApp</span>
            </a>

            <button type="button" className="share-sheet-later" onClick={handleDismissShareSheet}>
              Maybe later
            </button>
          </div>
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

        <MotionReveal className="card-header" delay={160}>
          <span className="profile-label">AURA SIGNATURE</span>
          <h2 className="profile-name">{vibe.name}</h2>
        </MotionReveal>

        <MotionReveal className="archetype-badge float-anim" delay={240} variant="pop">
          <span className="archetype-emoji">{vibe.emoji}</span>
          <h3 className="archetype-title">{vibe.archetypeTitle}</h3>
        </MotionReveal>

        <MotionReveal className="vibe-divider" delay={300}></MotionReveal>

        <MotionReveal as="p" className="vibe-description" delay={360}>
          "{vibe.description}"
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
        {shareRewardVisible && !shareSheetVisible && (
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
            <div className="button-grid">
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
            <div className="sharing-headline">✨ Spread the Good Vibes! ✨</div>
            <div className="button-grid">
              <a 
                href={getWhatsAppShareUrl()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`btn btn-whatsapp btn-share-magnet ${shareCelebrating ? 'is-sharing' : ''}`}
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
