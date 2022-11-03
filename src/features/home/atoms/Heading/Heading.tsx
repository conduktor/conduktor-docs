import React from 'react'
import { StyledHeading } from './Heading.styled'

interface HeadingProps {
  children: React.ReactNode
}

const Heading: React.FunctionComponent<HeadingProps> = ({ children }) => {
  return <StyledHeading>{children}</StyledHeading>
}

export default Heading
