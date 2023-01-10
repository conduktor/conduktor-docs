import Link from '@docusaurus/Link'
import React from 'react'
import styles from './Button.module.scss'

interface ButtonProps {
  id?: string
  to?: string
  href?: string
  target?: string
  width?: string | number | 'fit-content'
  hasArrow?: boolean
  type?: 'primary' | 'secondary' | 'gradient' | 'transparent'
  children: React.ReactNode
}

const Button: React.FunctionComponent<ButtonProps> = ({
  id,
  to,
  href,
  target,
  width,
  hasArrow,
  type = 'primary',
  children,
}) => {
  return href ? (
    <a
      className={styles.Button}
      id={id}
      href={href}
      target={target}
      style={{ width }}
      data-type={type}
      data-arrow={hasArrow}
    >
      {children}
      {hasArrow && <span>→</span>}
    </a>
  ) : (
    <Link
      className={styles.Button}
      id={id}
      to={to}
      target={target}
      style={{ width }}
      data-type={type}
      data-arrow={hasArrow}
    >
      {children}
      {hasArrow && <span>→</span>}
    </Link>
  )
}

export default Button
