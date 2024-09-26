import { styled } from '@site/src/styles'

export const StyledBanner = styled('div', {
  border: '1px solid $olive5',
  borderRadius: '$radius6',
  padding: '$space9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '$space9 auto $space9 auto',
  width: '100%',

  svg: {
    width: 64,
    height: 64,
    marginTop: 9,
  },
})

export const Title = styled('strong', {
  fontSize: '$fontSize4',
  fontWeight: '$medium',
  color: '$olive12',
})

export const Paragraph = styled('p', {
  color: '$olive11',
  letterSpacing: '-0.15px',

  variants: {
    breakpoint: {
      initial: {
        width: '50ch',
      },
      bp3: {
        width: '100%',
      },
    },
  },
})
