import React from 'react'
import styles from './Badge.module.scss'

interface BadgeProps {
  children: React.ReactNode
  type?: 'soon' | 'legacy'
}

const Badge: React.FunctionComponent<BadgeProps> = ({ type = 'soon', children }) => {
  return (
    <span className={styles.StyledBadge} data-type={type}>
      {children}
    </span>
  )
}

export default Badge
