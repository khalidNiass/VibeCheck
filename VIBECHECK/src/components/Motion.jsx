import { useEffect, useRef, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

export default function MotionReveal({
  as: Element = 'div',
  children,
  className = '',
  delay = 0,
  variant = 'rise',
  inView = false,
  ...props
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(() => {
    if (!inView) return true;
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (!inView || reducedMotion || isVisible) {
      return undefined;
    }

    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [inView, isVisible, reducedMotion]);

  return (
    <Element
      ref={ref}
      className={`motion-reveal motion-${variant} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ '--motion-delay': `${delay}ms` }}
      {...props}
    >
      {children}
    </Element>
  );
}
