import { styled } from '@site/src/styles'

export const StyledGridBackground = styled('div', {
  backgroundImage:
    'linear-gradient($mauve3 1px, transparent 1px), linear-gradient(90deg, $mauve3 1px, transparent 1px), linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
  backgroundSize: '64px 64px, 64px 64px, 20px 20px, 20px 20px',
  backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
  borderBottom: '1px solid $mauve3',

  variants: {
    breakpoint: {
      '@bp3': {
        backgroundSize: '36px 36px, 36px 36px, 20px 20px, 20px 20px !important',
      },

      '@bp4': {
        backgroundSize: '48px 48px, 48px 48px, 20px 20px, 20px 20px !important',
      },

      '@bp5': {
        backgroundSize: '64px 64px, 64px 64px, 20px 20px, 20px 20px !important',
      },
    },
  },
})
