import Link from '@docusaurus/Link'
import { keyframes, styled } from '@site/src/styles'
import { ANIMATION_DURATION } from '../../organisms/Switcher/Switcher.constants'

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
  backgroundColor: '#fff',
  border: '1px solid rgba(0, 0, 0, 0.07)',
  boxShadow: '$shadow6',
  borderRadius: '$radius5',
  padding: '$space6',

  variants: {
    fade: {
      in: {
        animation: `${scaleIn} ${ANIMATION_DURATION}ms ease`,
      },
      out: {
        animation: `${scaleOut} ${ANIMATION_DURATION}ms ease`,
      },
    },
  },
})

export const List = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
  gap: '$space6',
})

export const ListItem = styled('li', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '$radius3',
  transition: 'background-color 200ms ease',
  maxWidth: '600px',

  '&:hover, &:focus': {
    backgroundColor: '$olive2',
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
  width: 48,
  height: 48,
})

export const ListItemTitle = styled('strong', {
  fontSize: '$fontSize2',
  color: '$olive12',
})

export const ListItemParagraph = styled('p', {
  all: 'unset',
  color: '$olive11',
  fontSize: '$fontSize2',
})

export const ListItemBadge = styled('div', {
  marginRight: '$space6',
})
