import { useEffect, useRef, useState } from 'react';

type Phase = 'enter' | 'exit' | 'idle';

/** Duration matching --duration-base (200ms) for screen-enter/screen-exit keyframes */
const TRANSITION_MS = 200;

export interface ScreenTransitionProps {
  /** Key that identifies the current screen — change triggers exit→enter cycle */
  screenKey: string;
  children: React.ReactNode;
}

export function ScreenTransition({ screenKey, children }: ScreenTransitionProps) {
  const [phase, setPhase] = useState<Phase>('enter');
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const prevKey = useRef(screenKey);
  const pendingChildren = useRef(children);

  useEffect(() => {
    if (screenKey !== prevKey.current) {
      // Screen changed — start exit phase with old content still displayed
      pendingChildren.current = children;
      prevKey.current = screenKey;
      setPhase('exit');
    } else {
      // Same screen, just update children in place
      setDisplayedChildren(children);
      pendingChildren.current = children;
    }
  }, [screenKey, children]);

  // Advance the phase state machine after the animation duration
  useEffect(() => {
    if (phase === 'idle') return;

    const timer = setTimeout(() => {
      if (phase === 'exit') {
        setDisplayedChildren(pendingChildren.current);
        setPhase('enter');
      } else if (phase === 'enter') {
        setPhase('idle');
      }
    }, TRANSITION_MS);

    return () => clearTimeout(timer);
  }, [phase]);

  const animationClass =
    phase === 'enter' ? 'animate-screen-enter' : phase === 'exit' ? 'animate-screen-exit' : '';

  return (
    <div className={animationClass} data-transition-phase={phase}>
      {displayedChildren}
    </div>
  );
}
