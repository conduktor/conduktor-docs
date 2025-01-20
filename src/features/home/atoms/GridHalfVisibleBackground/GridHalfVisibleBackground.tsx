import React from 'react'
import { StyledGridBackground } from './GridHalfVisibleBackground.styled'

interface GridBackgroundProps {
  children: React.ReactNode | React.ReactNode[]
}

const GridHalfVisibleBackground: React.FunctionComponent<GridBackgroundProps> = ({ children }) => {
  return <StyledGridBackground>{children}</StyledGridBackground>
}

export default GridHalfVisibleBackground
