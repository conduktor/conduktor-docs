import Button from '@site/src/components/atoms/Button'
import Flex from '@site/src/components/atoms/Flex'
import React from 'react'
import { Content, Icon, Paragraph, StyledDesktop, Title } from './Desktop.styled'

interface DesktopProps {}

const Desktop: React.FunctionComponent<DesktopProps> = () => {
  return (
    <StyledDesktop>
      <Content>
        <Flex direction="row" align="center">
          <Icon src="/assets/svgs/desktop.svg" alt="Conduktor Desktop" />
          <Flex direction="column">
            <Title>Looking for Conduktor Desktop documentation?</Title>
            <Paragraph>All the features of our legacy product, documented.</Paragraph>
          </Flex>
        </Flex>
      </Content>
      <Button to="/desktop">Read now</Button>
    </StyledDesktop>
  )
}

export default Desktop
