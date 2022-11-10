import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import Button from '@site/src/components/atoms/Button'
import React from 'react'
import { items } from './NavLinks.constants'
import styles from './NavLinks.module.scss'

interface NavLinksProps {}

const NavLinks: React.FunctionComponent<NavLinksProps> = () => {
  const location = useLocation()
  const { pathname } = location
  const isHome = pathname === '/'

  return (
    <ul className={styles.StyledNavLinks}>
      <li>
        <Link className={styles.NavLink} to={isHome ? '/platform' : '/'}>
          {isHome ? 'Platform' : 'Home'}
        </Link>
      </li>
      {items.map((item, itemIndex) => (
        <li key={itemIndex}>
          <a className={styles.NavLink} href={item.href} target="_blank">
            {item.name}
          </a>
        </li>
      ))}
      <li>
        <Button href="https://www.conduktor.io/get-started">Get Started</Button>
      </li>
    </ul>
  )
}

export default NavLinks
