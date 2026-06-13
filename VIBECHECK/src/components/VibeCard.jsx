import { useCallback, useEffect, useRef, useState } from 'react';
import EmojiBurst from './EmojiBurst';
import MotionReveal from './Motion';

export default function VibeCard({ vibe, onReset, isShared = false }) {
  const [toastMessage, setToastMessage] = useState('');
  const [shareCelebrating, setShareCelebrating] = useState(false);
  const [shareRewardVisible, setShareRewardVisible] = useState(false);
  const [shareSheetVisible, setShareSheetVisible] = useState(false);
  const [shareSheetClosing, setShareSheetClosing] = useState(false);
  const [sharePending, setSharePending] = useState(false);
  const shareTimers = useRef([]);
  const closeTimer = useRef(null);
  const shareDialogRef = useRef(null);

  const [isUnlocked, setIsUnlocked] = useState(true);
  const [showUnlockBadge, setShowUnlockBadge] = useState(false);

  useEffect(() => {
    return () => {
      shareTimers.current.forEach((timer) => clearTimeout(timer));
      clearTimeout(closeTimer.current);
    };
  }, []);

  const closeShareSheet = useCallback(() => {
    clearTimeout(closeTimer.current);
    if (!shareSheetVisible) return;

    setShareSheetClosing(true);
    closeTimer.current = setTimeout(() => {
      setShareSheetVisible(false);
      setShareSheetClosing(false);
    }, 240);
  }, [shareSheetVisible]);

  const completeShareUnlock = useCallback(() => {
    shareTimers.current.forEach((timer) => clearTimeout(timer));
    clearTimeout(closeTimer.current);

    setSharePending(false);
    setIsUnlocked(true);
    setShowUnlockBadge(true);
    setShareCelebrating(true);
    setShareRewardVisible(true);
    setShareSheetVisible(false);
    setShareSheetClosing(false);

    try {
      sessionStorage.setItem(`vibecheck_unlocked_${vibe.name}_${vibe.shareVariant}`, 'true');
    } catch (e) {
      console.warn('sessionStorage is not accessible', e);
    }

    shareTimers.current = [
      setTimeout(() => setShareCelebrating(false), 900),
      setTimeout(() => setShareRewardVisible(false), 5200),
      setTimeout(() => setShowUnlockBadge(false), 4000)
    ];
  }, [vibe.name, vibe.shareVariant]);

  useEffect(() => {
    if (isShared) return undefined;

    const timer = setTimeout(() => {
      setShareSheetClosing(false);
      setShareSheetVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isShared, vibe.name]);

  useEffect(() => {
    if (!shareSheetVisible || shareSheetClosing) return undefined;

    const dialog = shareDialogRef.current;
    const focusable = dialog?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeShareSheet();
        return;
      }

      if (event.key === 'Tab' && dialog) {
        const focusableElements = Array.from(
          dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        ).filter((element) => !element.disabled && element.offsetParent !== null);
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeShareSheet, shareSheetClosing, shareSheetVisible]);

  useEffect(() => {
    if (!sharePending) return undefined;

    let armed = false;
    const armTimer = setTimeout(() => {
      armed = true;
    }, 300);

    const completeWhenReturned = () => {
      if (armed && document.visibilityState === 'visible') {
        completeShareUnlock();
      }
    };

    window.addEventListener('focus', completeWhenReturned);
    window.addEventListener('pageshow', completeWhenReturned);
    document.addEventListener('visibilitychange', completeWhenReturned);

    return () => {
      clearTimeout(armTimer);
      window.removeEventListener('focus', completeWhenReturned);
      window.removeEventListener('pageshow', completeWhenReturned);
      document.removeEventListener('visibilitychange', completeWhenReturned);
    };
  }, [completeShareUnlock, sharePending]);

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

  const handleWhatsAppShare = () => {
    shareTimers.current.forEach((timer) => clearTimeout(timer));

    setSharePending(true);
    setShareCelebrating(true);
    closeShareSheet();

    shareTimers.current = [
      setTimeout(() => setShareCelebrating(false), 900)
    ];
  };

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) {
      setToastMessage('More sharing options are not available here. WhatsApp is ready to go.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    try {
      await navigator.share({
        title: `${vibe.name}'s VibeCheck`,
        text: vibe.shareText || `${vibe.name}'s VibeCheck is ${vibe.archetypeTitle} ${vibe.emoji}`,
        url: getShareUrl()
      });
      completeShareUnlock();
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setToastMessage('Sharing was not available. Try WhatsApp or copy the link.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    }
  };

  const getPrimaryWhatsAppShareUrl = () => {
    const shareUrl = getShareUrl();
    const text = [
      '\uD83D\uDC9A Okay this VibeCheck got weirdly accurate \uD83D\uDC40',
      vibe.emoji + ' ' + vibe.name + "'s vibe came out as: " + vibe.archetypeTitle,
      'Now I need to know what yours says \uD83D\uDE04',
      shareUrl
    ].join('\n\n');
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const renderPrimaryWhatsAppButton = (className) => (
    <a
      href={getPrimaryWhatsAppShareUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleWhatsAppShare}
    >
      <span className="whatsapp-button-icon">WA</span>
      <span className="share-button-label">{'\uD83D\uDC9A'} Share on WhatsApp</span>
    </a>
  );

  const renderMoreShareButton = (className = 'btn btn-secondary btn-share-secondary') => (
    <button
      type="button"
      className={className}
      onClick={handleNativeShare}
    >
      <span aria-hidden="true">+</span>
      <span className="share-button-label">More ways to share</span>
    </button>
  );

  return (
    <div className="vibe-card-container">
      <EmojiBurst />

      {/* Share Sheet modal - Strict gating mode */}
      {!isShared && (shareSheetVisible || shareSheetClosing) && (
        <div
          className={`share-sheet-backdrop ${shareCelebrating ? 'is-sharing' : ''} ${shareSheetClosing ? 'is-closing' : ''}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeShareSheet();
          }}
        >
          <div
            ref={shareDialogRef}
            className={`share-sheet ${shareCelebrating ? 'is-sharing' : ''} ${shareSheetClosing ? 'is-closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-sheet-title"
            aria-describedby="share-sheet-copy"
          >
            <button
              type="button"
              className="share-sheet-close"
              aria-label="Close share prompt"
              onClick={closeShareSheet}
            >
              ×
            </button>
            <div className="share-sheet-brand" aria-hidden="true">
              <img src="/logo.png" alt="" />
              <span>VibeCheck</span>
            </div>

            <div className="share-sheet-kicker">Ta-da 🎉</div>
            <h3 id="share-sheet-title" className="share-sheet-title">This result is share worthy 😄</h3>
            <p id="share-sheet-copy" className="share-sheet-copy">Send it to the group chat and see who gets the most surprising match.</p>

            {renderPrimaryWhatsAppButton(
              `btn btn-whatsapp share-sheet-button ${shareCelebrating ? 'is-sharing' : ''}`
            )}
            {renderMoreShareButton()}
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
          <p className="vibe-description">
            "{vibe.description}"
          </p>
          {!isUnlocked && !isShared && (
            <div className="vibe-description-overlay">
              <span className="lock-icon" aria-hidden="true">🔒</span>
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
            <div className="share-section-card">
              {renderPrimaryWhatsAppButton(
                `btn btn-whatsapp btn-share-magnet ${shareCelebrating ? 'is-sharing' : ''}`
              )}
              {renderMoreShareButton()}
              <button onClick={handleCopyLink} className="btn btn-secondary">
                Copy Link
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="share-section-card">
              <div className="sharing-headline">✨ Spread the Good Vibes! ✨</div>
              {renderPrimaryWhatsAppButton(
                `btn btn-whatsapp btn-share-magnet ${(!isUnlocked && !isShared) ? 'pulse-glow' : ''} ${shareCelebrating ? 'is-sharing' : ''}`
              )}
              {renderMoreShareButton()}
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
