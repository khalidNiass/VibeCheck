import { useEffect, useState } from 'react';

export default function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(query.matches);

    query.addEventListener('change', updatePreference);

    return () => query.removeEventListener('change', updatePreference);
  }, []);

  return reducedMotion;
}
