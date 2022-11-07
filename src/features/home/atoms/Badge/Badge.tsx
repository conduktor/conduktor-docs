import React from 'react'
import styles from './Badge.module.scss'

interface BadgeProps {
  children: React.ReactNode
}

const Badge: React.FunctionComponent<BadgeProps> = ({ children }) => {
  return <span className={styles.StyledBadge}>{children}</span>
}

export default Badge
