import React from 'react'
import { StyledContainer } from './Container.styled'

interface ContainerProps {
  children: React.ReactNode | React.ReactNode[]
}

const Container: React.FunctionComponent<ContainerProps> = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>
}

export default Container
