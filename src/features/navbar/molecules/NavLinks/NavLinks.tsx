import React from 'react'
import { items } from './NavLinks.constants'
import { NavItem, NavLink, StyledNavLinks } from './NavLinks.styled'

interface NavLinksProps {}

const NavLinks: React.FunctionComponent<NavLinksProps> = () => {
  return (
    <StyledNavLinks>
      {items.map((item, itemIndex) => (
        <NavItem key={itemIndex}>
          <NavLink to={item.href}>{item.name}</NavLink>
        </NavItem>
      ))}
    </StyledNavLinks>
  )
}

export default NavLinks
