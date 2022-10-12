import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import React from 'react'
import { StyledHeader } from './Header.styled'

interface HeaderProps {}

const Header: React.FunctionComponent<HeaderProps> = () => {
  const { siteConfig } = useDocusaurusContext()

  return (
    <StyledHeader>
      <h1>{siteConfig.title}</h1>
      <p>{siteConfig.tagline}</p>
    </StyledHeader>
  )
}

export default Header
