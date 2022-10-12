import { keyframes } from '..'

export const fadeOutUp = keyframes({
  '0%': {
    opacity: 1,
    transform: 'none',
  },
  '100%': {
    opacity: 0,
    transform: 'translateY(-20px)',
  },
})
