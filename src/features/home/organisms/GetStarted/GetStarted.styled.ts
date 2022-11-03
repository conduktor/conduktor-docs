import { styled } from '../../../../styles'
import { fadeInUp } from '../../../../styles/keyframes/fadeInUp'

const NEGATIVE_MARGIN = 276
export const StyledGetStarted = styled('div', {
  position: 'relative',
  marginBottom: NEGATIVE_MARGIN,

  variants: {
    breakpoint: {
      initial: {
        padding: '$space14 0',
        backgroundSize: '64px 64px, 64px 64px, 20px 20px, 20px 20px',
      },
      bp3: {
        padding: '$space9 0',
        backgroundSize: '36px 36px, 36px 36px, 20px 20px, 20px 20px !important',
      },
      bp4: {
        backgroundSize: '48px 48px, 48px 48px, 20px 20px, 20px 20px !important',
      },
      bp5: {
        backgroundSize: '64px 64px, 64px 64px, 20px 20px, 20px 20px !important',
      },
    },
  },
})

export const Card = styled('div', {
  display: 'grid',
  position: 'relative',
  boxShadow:
    '0px 283px 113px rgba(85, 48, 247, 0.01), 0px 159px 95px rgba(85, 48, 247, 0.03), 0px 71px 71px rgba(85, 48, 247, 0.05), 0px 18px 39px rgba(85, 48, 247, 0.06), 0px 0px 0px rgba(85, 48, 247, 0.06)',
  marginBottom: -NEGATIVE_MARGIN,
  animation: `${fadeInUp} 800ms 0ms both`,
  borderRadius: '$radius7',
  zIndex: '$zIndex1',

  variants: {
    breakpoint: {
      initial: {
        gridTemplateColumns: '1fr 1fr',
      },
      bp3: {
        gridTemplateColumns: '1fr',
      },
    },
  },
})

export const CardContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  variants: {
    breakpoint: {
      initial: {
        padding: '$space12',
      },
      bp3: {
        padding: '$space9',
      },
    },
  },
})

export const CardTitle = styled('h2', {
  color: '$mauve12',
  fontSize: '$fontSize10',
  fontWeight: '$semi',
  marginBottom: '$space6',
  lineHeight: '45px',
})

export const CardParagraph = styled('p', {
  color: '$mauve11',
  fontSize: '$fontSize4',
  marginBottom: '$space10',
  display: 'block',
})

export const PlatformVisualContainer = styled('a', {
  all: 'unset',
  display: 'flex',
  alignItems: 'flex-end',
  cursor: 'pointer',
  overflow: 'hidden',
  paddingTop: '$space12',

  '&:hover img': {
    transform: 'translateY(-10px)',
  },
})

export const PlatformVisual = styled('img', {
  borderBottomRightRadius: '$radius7',
  marginBottom: -10,
  transition: 'transform 200ms ease-in-out',

  variants: {
    breakpoint: {
      initial: {
        display: 'block',
      },
      bp3: {
        display: 'none',
      },
    },
  },
})

export const LightbeamVisual = styled('img', {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: -1,
})
