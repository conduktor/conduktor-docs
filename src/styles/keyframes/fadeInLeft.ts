import { keyframes } from '..'

export const fadeInLeft = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateX(-100%)',
  },
  '100%': {
    opacity: 1,
    transform: 'none',
  },
})
