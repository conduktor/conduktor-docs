import { styled } from '@site/src/styles'
import { pulse } from '@site/src/styles/keyframes'

export const StyledSearchInput = styled('div', {
  backgroundColor: 'rgb(255 255 255 / 90%)',
  backdropFilter: 'blur(8px)',
  fontSize: '$fontSize3',
  fontWeight: '$medium',
  position: 'relative',
  width: '100%',
  color: '$olive11',
  margin: '0 auto',
  boxShadow: '$shadow1',
  animation: `${pulse} 200ms 0ms both`,
  animationTimingFunction: 'ease-in-out',

  variants: {
    isHits: {
      true: {
        borderTopLeftRadius: '$radius3',
        borderTopRightRadius: '$radius3',
      },
      false: {
        borderRadius: '$radius3',
      },
    },
  },
})

export const SearchInputIcon = styled('img', {
  width: 24,
  height: 24,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: '$space5',
  pointerEvents: 'none',
})

export const SearchInputText = styled('input', {
  all: 'unset',
  width: '100%',
  padding: '$space6 $space6 $space6 $space11',
  color: '$olive12',
})
