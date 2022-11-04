import { styled } from '@site/src/styles'

export const StyledCommunity = styled('section', {
  marginBottom: '$space14',
})

export const List = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
  display: 'flex',
  gap: '$space8',
})

export const ListItem = styled('li', {
  width: '100%',
  borderRadius: '$radius3',
  border: '1px solid $mauve4',
})

export const ListItemLink = styled('a', {
  all: 'unset',
  cursor: 'pointer',
  textDecoration: 'none !important',

  '&:hover': {
    strong: {
      color: '$purple9',
    },

    'div[data-visual="true"]': {
      backgroundColor: '$mauve3',
    },
  },
})

export const ListItemVisual = styled('div', {
  backgroundColor: '$mauve2',
  padding: '$space12 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 200ms ease-in-out',
})

export const ListItemVisualIcon = styled('img', {})

export const ListItemContent = styled('div', {
  padding: '$space8',
})

export const ListItemTitle = styled('strong', {
  color: '$mauve12',
  fontSize: '$fontSize5',
  lineHeight: '$fit',
  marginBottom: '$space8',
  display: 'block',
  transition: 'color 200ms ease-in-out',
})

export const ListItemParagraph = styled('p', {
  color: '$mauve11',
})
