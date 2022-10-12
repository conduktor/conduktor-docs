import { keyframes } from '..'

export const fadeInDown = keyframes({
  '0%, 100%': {
    transitionTimingFunction: 'ease-out',
  },
  '0%': {
    opacity: 0,
    transform: 'translateY(-10px)',
  },
  '100%': {
    opacity: 1,
    transform: 'none',
  },
})
