import '@docsearch/css'
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
    </StyledNavbar>
  )
}

export default Navbar
