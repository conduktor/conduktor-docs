import { styled } from '@site/src/styles'

export const StyledSearchHits = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
  backgroundColor: 'rgb(255 255 255 / 90%)',
  backdropFilter: 'blur(8px)',
  borderBottomLeftRadius: '$radius3',
  borderBottomRightRadius: '$radius3',
  display: 'block',
  height: 'calc(100vh - (var(--space-space16) * 2) - 86px)',
  overflowY: 'auto',
})

export const Hit = styled('li', {
  a: {
    all: 'unset',
    display: 'block',
    cursor: 'pointer',
    padding: '$space6',
    transition: 'background-color 200ms ease-in-out',

    '&:hover, &:focus': {
      backgroundColor: '$mauve4',
    },
  },
})

export const HitTitle = styled('strong', {
  display: 'block',
  fontWeight: '$semi',
  fontSize: '$fontSize2',

  i: {
    all: 'unset',
    color: '$purple9',
  },
})

export const HitDescription = styled('p', {
  all: 'unset',
  display: 'block',
  fontSize: '$fontSize1',

  i: {
    all: 'unset',
    color: '$purple9',
  },
})
