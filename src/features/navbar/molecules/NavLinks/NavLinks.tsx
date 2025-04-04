import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import Button from '@site/src/components/atoms/Button'
import React from 'react'
import { items as ProductItems } from '../../../../features/home/organisms/Products/Products.constants'
import { items } from './NavLinks.constants'
import styles from './NavLinks.module.scss'

interface NavLinksProps {}

const NavLinks: React.FunctionComponent<NavLinksProps> = () => {
  const location = useLocation()
  const { pathname } = location
  const isHome = pathname === '/'
  const isConsole = pathname === '/platform/'
  const isGateway = pathname === '/gateway/'

  return (
    <ul className={styles.StyledNavLinks}>
      <li>
        <Link className={styles.NavLink} to={isHome ? '/platform' : '/'}>
          {isHome ? 'Platform' : 'Home'}
        </Link>
      </li>
      {isGateway && (
        <li>
          <Link className={styles.NavLink} to={isHome ? '/gateway' : '/platform'}>
            {isHome ? 'Gateway' : 'Platform'}
          </Link>
        </li>
      )}
      {isConsole && (
        <li>
          <Link className={styles.NavLink} to={isHome ? '/gateway' : '/gateway'}>
            {isHome ? 'Gateway' : 'Gateway'}
          </Link>
        </li>
      )}
      {isHome && (
        <li>
          <Link className={styles.NavLink} to={isHome ? '/gateway' : '/gateway'}>
            {isHome ? 'Gateway' : 'Gateway'}
          </Link>
        </li>
      )}
      {items.map((item, itemIndex) => (
        <li key={itemIndex}>
          {item.href && (
            <a className={styles.NavLink} href={item.href} target="_blank">
              {item.name}
            </a>
          )}
          {item.to && (
            <Link className={styles.NavLink} to={item.to}>
              {item.name}
            </Link>
          )}
        </li>
      ))}
      {ProductItems.map((item, itemIndex) => (
        <li
          key={itemIndex}
          data-divider={itemIndex === 0 ? true : false}
          data-icon={true}
          className={`${item.name.toLocaleLowerCase().replace(/ /g, '-')} ${styles.NavLinkMobile}`}
        >
          <Link to={item.to}>{item.name}</Link>
        </li>
      ))}
      <li data-get-started>
        <Button href="https://www.conduktor.io/get-started">Get started</Button>
      </li>
    </ul>
  )
}

export default NavLinks
