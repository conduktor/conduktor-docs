import Link from '@docusaurus/Link'
import { styled } from '@site/src/styles'

export const StyledNavLinks = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
  display: 'flex',
  gap: '$space9',
  alignItems: 'center',
})

export const NavItem = styled('li', {})

export const NavLink = styled(Link, {
  all: 'unset',
  cursor: 'pointer',
  color: '$mauve12',
  textDecoration: 'none !important',
  fontWeight: '$medium',
  fontSize: '$fontSize2',
  transition: 'color 200ms ease-in-out',
})
