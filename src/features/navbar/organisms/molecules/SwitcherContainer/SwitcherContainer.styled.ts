import Link from '@docusaurus/Link'
import { keyframes, styled } from '@site/src/styles'

const scaleIn = keyframes({
  from: { transform: 'rotateX(-30deg) scale(0.9)', opacity: 0 },
  to: { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
})

const scaleOut = keyframes({
  from: { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
  to: { transform: 'rotateX(-10deg) scale(0.95)', opacity: 0 },
})

export const StyledSwitcherContainer = styled('div', {
  position: 'absolute',
  top: 'var(--ifm-navbar-height)',
  left: 0,
  backgroundColor: '#fff',
  border: '1px solid rgba(0, 0, 0, 0.07)',
  boxShadow: '$shadow6',
  borderRadius: '$radius5',
  padding: '$space6',
  width: 730,
  animation: `${scaleIn} 200ms ease`,
})

export const List = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '$space6',
})

export const ListItem = styled('li', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '$radius3',
  transition: 'background-color 200ms ease',

  '&:hover, &:focus': {
    backgroundColor: '$mauve2',
  },
})

export const ListItemLink = styled(Link, {
  all: 'unset',
  cursor: 'pointer',
  textDecoration: 'none !important',
  padding: '$space5',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
})

export const ListItemIcon = styled('img', {
  marginRight: '$space6',
})

export const ListItemTitle = styled('strong', {
  fontSize: '$fontSize2',
  color: '$mauve12',
})

export const ListItemParagraph = styled('p', {
  all: 'unset',
  color: '$mauve11',
  fontSize: '$fontSize2',
})

export const ListItemBadge = styled('div', {
  marginRight: '$space6',
})
