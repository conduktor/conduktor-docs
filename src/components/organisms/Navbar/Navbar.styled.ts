import { styled } from '@site/src/styles'

export const StyledNavbar = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
  display: 'flex',
  justifyContent: 'space-between',
  gap: '$space10',
  width: '100%',
})

export const NavbarItem = styled('li', {
  display: 'flex',
})
