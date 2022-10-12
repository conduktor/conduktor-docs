import { keyframes } from '..'

export const fadeInRightHalf = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateX(50%)',
  },
  '100%': {
    opacity: 1,
    transform: 'none',
  },
})
