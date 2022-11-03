import React from 'react'
import { StyledButton } from './Button.styled'

interface ButtonProps {
  id?: string
  href?: string
  target?: string
  width?: string | number | 'fit-content'
  children: React.ReactNode
}

const Button: React.FunctionComponent<ButtonProps> = ({ id, href, target, width, children }) => {
  return (
    <StyledButton id={id} href={href} target={target} css={{ width }}>
      {children}
    </StyledButton>
  )
}

export default Button
