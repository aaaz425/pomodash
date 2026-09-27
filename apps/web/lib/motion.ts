import type { Transition } from 'framer-motion';

export function withReducedMotion(reduced: boolean, transition: Transition): Transition {
  return reduced ? { ...transition, duration: 0 } : transition;
}
