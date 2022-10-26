import { styled } from '@site/src/styles'
import { fadeIn } from '@site/src/styles/keyframes'
import { fadeOut } from './../../../styles/keyframes/fadeOut'
import { ANIMATION_DURATION } from './SearchModal.constants'

export const StyledSearchModal = styled('div', {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: '100vh',
  zIndex: '$zIndexMax',
  display: 'flex',
  justifyContent: 'center',
  padding: '$space16 0',
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(8px)',
  opacity: 0,

  variants: {
    fade: {
      in: {
        animation: `${fadeIn} ${ANIMATION_DURATION}ms 0ms both`,
      },
      out: {
        animation: `${fadeOut} ${ANIMATION_DURATION}ms 0ms both`,
      },
    },
  },
})

export const ContentContainer = styled('div', {
  width: 600,
  height: 'fit-content',
})
