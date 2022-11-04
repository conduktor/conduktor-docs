import { styled } from '@site/src/styles'

export const StyledGuides = styled('section', {})

export const List = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
  display: 'flex',
  gap: '$space8',
  paddingBottom: '$space14',
  marginBottom: '$space14',
  borderBottom: '1px solid $mauve4',
})

export const ListItem = styled('li', {
  width: '100%',
})

export const ListItemLink = styled('a', {
  all: 'unset',
  cursor: 'pointer',
  textDecoration: 'none !important',
  padding: '$space8',
  borderRadius: '$radius5',
  backgroundColor: '#fff',
  border: '1px solid $mauve4',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '$shadow1',

  '&:hover': {
    strong: {
      color: '$purple9',
    },
    'img[data-arrow="true"]': {
      opacity: 1,
      transform: 'rotate(0deg) translateX(5px)',
    },
  },
})

export const ListItemIcon = styled('img', {})

export const ListItemTitle = styled('strong', {
  color: '$mauve12',
  marginLeft: '$space5',
  transition: 'color 200ms ease-in-out',
  display: 'flex',
  alignItems: 'center',
})

export const ListItemTitleArrow = styled('img', {
  width: 16,
  height: 16,
  marginLeft: '$space4',
  opacity: 0,
  transform: 'rotate(0deg)',
  transition: 'transform 250ms ease-out, opacity 200ms ease-out',
  marginTop: 2,
})
