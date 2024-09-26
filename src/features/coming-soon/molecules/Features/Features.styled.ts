import { styled } from '@site/src/styles'

export const StyledFeatures = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
})

export const Feature = styled('li', {
  color: '$olive12',
  fontWeight: '$medium',
  letterSpacing: '-0.15px',
  display: 'flex',
  alignItems: 'center',
  marginTop: '0px !important',

  '&:not(:last-child)': {
    marginBottom: '$space5',
  },
})

export const FeatureIcon = styled('img', {
  minWidth: 16,
  minHeight: 16,
  width: 16,
  height: 16,
  display: 'block',
  marginRight: '$space6',
})
