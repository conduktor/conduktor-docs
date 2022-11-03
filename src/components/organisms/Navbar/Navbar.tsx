import '@docsearch/css'
import NavLinks from '@site/src/features/navbar/molecules/NavLinks/NavLinks'
import Switcher from '@site/src/features/navbar/organisms/Switcher'
import React from 'react'
import SearchInput from '../../molecules/SearchInput'
import { NavbarItem, StyledNavbar } from './Navbar.styled'

interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
  return (
    <StyledNavbar>
      <NavbarItem>
        <Switcher />
      </NavbarItem>
      <NavbarItem>
        <SearchInput compact={true} />
      </NavbarItem>
      <NavbarItem>
        <NavLinks />
      </NavbarItem>
    </StyledNavbar>
  )
}

export default Navbar
