import React from 'react'
import { StyledContainer } from './Container.styled'

interface ContainerProps {
  children: React.ReactNode
}

const Container: React.FunctionComponent<ContainerProps> = ({ children }) => {
  return (
    <StyledContainer breakpoint={{ '@initial': 'initial', '@bp3': 'bp3' }}>
      {children}
    </StyledContainer>
  )
}

export default Container
