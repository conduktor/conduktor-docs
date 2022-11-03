import '@docsearch/css'
import React from 'react'
import SearchInput from '../../molecules/SearchInput'
import { NavbarItem, StyledNavbar } from './Navbar.styled'

interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
  return (
    <StyledNavbar>
      <NavbarItem>
        <SearchInput compact={true} />
      </NavbarItem>
    </StyledNavbar>
  )
}

export default Navbar
