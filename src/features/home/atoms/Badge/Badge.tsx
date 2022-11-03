import React from 'react'
import { StyledBadge } from './Badge.styled'

interface BadgeProps {
  children: React.ReactNode
}

const Badge: React.FunctionComponent<BadgeProps> = ({ children }) => {
  return <StyledBadge>{children}</StyledBadge>
}

export default Badge
