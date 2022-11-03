import Link from '@docusaurus/Link'
import { styled } from '@site/src/styles'

export const StyledProducts = styled('section', {})

export const List = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
  display: 'flex',
  gap: '$space8',
})

export const ListItem = styled('li', {
  width: '100%',
})

export const ListItemLink = styled(Link, {
  all: 'unset',
  cursor: 'pointer',
  textDecoration: 'none !important',

  '&:hover': {
    div: {
      filter: 'grayscale(0.05)',

      img: {
        transform: 'scale(1.02) translateY(-5px)',
        boxShadow: '$shadow5',
      },
    },

    strong: {
      color: '$purple9',
    },
  },
})

export const ListVisual = styled('div', {
  padding: '$space10 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$purple9',
  borderRadius: '$radius5',
  marginBottom: '$space8',
  transition: 'filter 200ms ease-in-out',
})

export const ListVisualImage = styled('img', {
  boxShadow: '$shadow3',
  transition: 'transform 200ms ease-in-out, box-shadow 200ms ease-in-out',
})

export const ListItemName = styled('strong', {
  all: 'unset',
  color: '$mauve12',
  fontWeight: '$semi',
  lineHeight: '$fit',
  letterSpacing: '-0.15px',
  display: 'block',
  marginBottom: '$space1',
  transition: 'color 200ms ease-in-out',
})

export const ListItemDescription = styled('p', {
  all: 'unset',
  color: '$mauve11',
  letterSpacing: '-0.15px',
})
