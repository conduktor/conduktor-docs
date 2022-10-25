import '@docsearch/css'
import React from 'react'
import SearchInput from '../../../features/navbar/molecules/SearchInput'
import { NavbarItem, StyledNavbar } from './Navbar.styled'

interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
  return (
    <StyledNavbar>
      <NavbarItem>
        <SearchInput />
      </NavbarItem>
    </StyledNavbar>
  )
}

export default Navbar
