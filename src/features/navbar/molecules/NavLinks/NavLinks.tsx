import { useLocation } from '@docusaurus/router'
import Button from '@site/src/components/atoms/Button'
import React from 'react'
import { items } from './NavLinks.constants'
import { NavItem, NavLink, StyledNavLinks } from './NavLinks.styled'

interface NavLinksProps {}

const NavLinks: React.FunctionComponent<NavLinksProps> = () => {
  const location = useLocation()
  const { pathname } = location
  const isHome = pathname === '/'

  return (
    <StyledNavLinks>
      <NavItem>
        <NavLink to={isHome ? '/platform' : '/'}>{isHome ? 'Platform' : 'Home'}</NavLink>
      </NavItem>
      {items.map((item, itemIndex) => (
        <NavItem key={itemIndex}>
          <NavLink to={item.href}>{item.name}</NavLink>
        </NavItem>
      ))}
      <NavItem>
        <Button href="https://www.conduktor.io/get-started">Get Started</Button>
      </NavItem>
    </StyledNavLinks>
  )
}

export default NavLinks
