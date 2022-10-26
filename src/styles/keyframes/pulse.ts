import { keyframes } from '..'

export const pulse = keyframes({
  '0%': {
    transform: 'scale3d(1, 1, 1)',
  },
  '50%': {
    transform: 'scale3d(1.05, 1.05, 1.05)',
  },
  '100%': {
    transform: 'scale3d(1, 1, 1)',
  },
})
