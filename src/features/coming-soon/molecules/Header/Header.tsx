import Flex from '@site/src/components/atoms/Flex'
import React from 'react'
import { Badge, Icon, StyledHeader, Title } from './Header.styled'

interface HeaderProps {
  icon: string
  title: string
}

const Header: React.FunctionComponent<HeaderProps> = ({ icon, title }) => {
  React.useEffect(() => {
    const headingElement = document.querySelector('main h1') as HTMLElement
    if (headingElement) headingElement.style.display = 'none'

    return () => {
      if (headingElement) headingElement.style.display = ''
    }
  }, [])

  return (
    <StyledHeader>
      <Flex direction="row" align="center">
        <Icon src={icon} alt="Solution icon" />
        <Flex direction="column">
          <Badge>Coming soon</Badge>
          <Title>{title}</Title>
        </Flex>
      </Flex>
    </StyledHeader>
  )
}

export default Header
