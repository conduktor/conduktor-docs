import { keyframes } from '..'

export const flipOutY = keyframes({
  'from, 30%, to': {
    backfaceVisibility: 'visible !important',
  },

  from: {
    transform: 'perspective(400px)',
  },

  '30%': {
    transform: 'perspective(400px) rotate3d(0, 1, 0, -15deg)',
    opacity: 1,
  },

  to: {
    transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)',
    opacity: 0,
  },
})
