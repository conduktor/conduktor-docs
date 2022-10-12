import { keyframes } from '..'

export const flipInY = keyframes({
  'from, 40%, 60%, 80%, to': {
    backfaceVisibility: 'visible !important',
  },

  from: {
    transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)',
    animationTimingFunction: 'ease-in',
    opacity: 0,
  },

  '40%': {
    transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)',
    animationTimingFunction: 'ease-in',
  },

  '60%': {
    transform: 'perspective(400px) rotate3d(0, 1, 0, 10deg)',
    opacity: 1,
  },

  '80%': {
    transform: 'perspective(400px) rotate3d(0, 1, 0, -5deg)',
  },

  to: {
    transform: 'perspective(400px)',
  },
})
