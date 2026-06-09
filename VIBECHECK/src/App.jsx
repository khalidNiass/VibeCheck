import { useState } from 'react';
import Header from './components/Header';
import VibeForm from './components/VibeForm';
import AuraScanner from './components/AuraScanner';
import VibeCard from './components/VibeCard';
import MotionReveal from './components/Motion';
import { SocialLinkButtons } from './components/SocialLinks';
import { generateVibe } from './utils/vibeGenerator';
import './App.css';

function App() {
  // Parse query parameters on load to check if viewing a shared vibe (lazy init)
  const [initialState] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get('name') || params.get('n');
      const variantParam = params.get('v');
      if (nameParam) {
        const cleanName = nameParam.trim();
        if (cleanName) {
          const vibe = generateVibe(cleanName, { variant: variantParam });
          if (vibe) {
            return { name: cleanName, currentVibe: vibe, screen: 'shared' };
          }
        }
      }
    }
    return { name: '', currentVibe: null, screen: 'home' };
  });

  const [name, setName] = useState(initialState.name);
  const [currentVibe, setCurrentVibe] = useState(initialState.currentVibe);
  const [screen, setScreen] = useState(initialState.screen);
  const [scanSignals, setScanSignals] = useState(null);

  // Handler for submitting a name
  const handleStartScan = (submittedName, signals = {}) => {
    setName(submittedName);
    setScanSignals(signals);
    setScreen('scanning');
  };

  // Handler for when the scanner animation completes
  const handleScanComplete = () => {
    const vibe = generateVibe(name, { signals: scanSignals });
    if (vibe) {
      setCurrentVibe(vibe);
      setScreen('result');
      
      // Update the browser URL without page reload so users can copy the address bar directly
      const newUrl = `${window.location.pathname}?name=${encodeURIComponent(vibe.name)}&v=${encodeURIComponent(vibe.shareVariant)}`;
      window.history.pushState({ name: vibe.name }, '', newUrl);
    } else {
      // In case of error, go back to form
      setScreen('home');
    }
  };

  // Handler to clear state and return to form
  const handleReset = () => {
    setName('');
    setScanSignals(null);
    setCurrentVibe(null);
    setScreen('home');
    
    // Clear query parameter from the browser URL
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <>
      {/* Brand Header */}
      <Header />

      {/* Main Content Area */}
      <main className="vibe-main-content">
        {screen === 'home' && (
          <VibeForm onSubmit={handleStartScan} initialName={name} />
        )}
        
        {screen === 'scanning' && (
          <AuraScanner onComplete={handleScanComplete} />
        )}
        
        {screen === 'result' && currentVibe && (
          <VibeCard vibe={currentVibe} onReset={handleReset} isShared={false} />
        )}
        
        {screen === 'shared' && currentVibe && (
          <VibeCard vibe={currentVibe} onReset={handleReset} isShared={true} />
        )}
      </main>

      {/* Brand Footer */}
      <MotionReveal as="footer" className="vibe-footer" delay={360} inView>
        <div className="footer-follow-vibe">
          <span className="footer-follow-label">Follow the vibe</span>
          <SocialLinkButtons ariaLabelPrefix="Open" />
        </div>
        <p>
          <strong>VibeCheck 🎭</strong> is built for curiosity and positive vibes.<br />
          No signup. No tracking. Made with positivity ✨.
        </p>
      </MotionReveal>
    </>
  );
}

export default App;
