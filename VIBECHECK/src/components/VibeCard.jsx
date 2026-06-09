import { useState } from 'react';

export default function VibeCard({ vibe, onReset, isShared = false }) {
  const [toastMessage, setToastMessage] = useState('');

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

  return (
    <div className="vibe-card-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notification fade-in" role="alert">
          {toastMessage}
        </div>
      )}

      {/* Shared Welcome Banner */}
      {isShared && (
        <div className="shared-banner fade-in">
          <span className="banner-wave">👋</span>
          <p className="banner-text">
            <strong>{vibe.name}</strong> shared their VibeCheck profile with you!
          </p>
        </div>
      )}

      {/* Main Glassmorphic Vibe Card */}
      <div className={`glass-panel vibe-card ${vibe.themeClass} fade-in`}>
        {/* Glow backdrop inside the card */}
        <div className="card-aura-glow"></div>

        <div className="card-header">
          <span className="profile-label">AURA SIGNATURE</span>
          <h2 className="profile-name">{vibe.name}</h2>
        </div>

        <div className="archetype-badge float-anim">
          <span className="archetype-emoji">{vibe.emoji}</span>
          <h3 className="archetype-title">{vibe.archetypeTitle}</h3>
        </div>

        <div className="vibe-divider"></div>

        <p className="vibe-description">
          "{vibe.description}"
        </p>

        <div className="stats-section">
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
        </div>

        <div className="mascot-badge">
          <span className="mascot-emoji">{vibe.mascotEmoji}</span>
          <span className="mascot-text">
            Spirit Charm: <strong>{vibe.mascotText}</strong>
          </span>
        </div>
      </div>

      {/* Sharing and Action Buttons */}
      <div className="action-area fade-in">
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
                className="btn btn-whatsapp"
              >
                Share {vibe.name}'s Vibe
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
                className="btn btn-whatsapp"
              >
                Share on WhatsApp 💬
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
      </div>
    </div>
  );
}
