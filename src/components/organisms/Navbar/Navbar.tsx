import '@docsearch/css'
import { useLocation } from '@docusaurus/router'
import useIsBrowser from '@docusaurus/useIsBrowser'
import NavLinks from '@site/src/features/navbar/molecules/NavLinks/NavLinks'
import Switcher from '@site/src/features/navbar/organisms/Switcher'
import React from 'react'
import SearchInput from '../../molecules/SearchInput'
import { NavbarItem, StyledNavbar } from './Navbar.styled'

interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
  const isBrowser = useIsBrowser()
  const location = useLocation()

  return (
    <StyledNavbar>
      <NavbarItem>
        <Switcher />
      </NavbarItem>
      {isBrowser && location.pathname !== '/' && (
        <NavbarItem>
          <SearchInput compact={true} />
        </NavbarItem>
      )}

      <NavbarItem>
        <NavLinks />
      </NavbarItem>
    </StyledNavbar>
  )
}

export default Navbar
