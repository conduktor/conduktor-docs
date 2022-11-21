import NavLinks from '@site/src/features/navbar/molecules/NavLinks/NavLinks'
import Switcher from '@site/src/features/navbar/organisms/Switcher'
import React from 'react'
import styles from './Navbar.module.scss'

interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
  return (
    <ul className={styles.StyledNavbar}>
      <li className={`${styles.NavbarItem} ${styles.Switcher}`}>
        <Switcher />
      </li>
      <li className={styles.NavbarItem}>
        <NavLinks />
      </li>
    </ul>
  )
}

export default Navbar
