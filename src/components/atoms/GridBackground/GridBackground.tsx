import React from 'react'
import { StyledGridBackground } from './GridBackground.styled'

interface GridBackgroundProps {
  children: React.ReactNode | React.ReactNode[]
}

const GridBackground: React.FunctionComponent<GridBackgroundProps> = ({ children }) => {
  return <StyledGridBackground>{children}</StyledGridBackground>
}

export default GridBackground
