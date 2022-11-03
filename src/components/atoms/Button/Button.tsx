import React from 'react'
import { ButtonHref, ButtonLink } from './Button.styled'

interface ButtonProps {
  id?: string
  to?: string
  href?: string
  target?: string
  width?: string | number | 'fit-content'
  children: React.ReactNode
}

const Button: React.FunctionComponent<ButtonProps> = ({
  id,
  to,
  href,
  target,
  width,
  children,
}) => {
  return href ? (
    <ButtonHref id={id} href={href} target={target} css={{ width }}>
      {children}
    </ButtonHref>
  ) : (
    <ButtonLink id={id} href={href} target={target} css={{ width }}>
      {children}
    </ButtonLink>
  )
}

export default Button
