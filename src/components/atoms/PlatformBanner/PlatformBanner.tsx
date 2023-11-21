import Logo from '@site/static/assets/svgs/products/admin.svg'
import React, { FunctionComponent } from 'react'
import { isMobile } from 'react-device-detect'
import Flex from '../../../components/atoms/Flex'
import Button from '../Button'
import { Paragraph, StyledBanner, Title } from './PlatformBanner.styled'

interface BannerProps {}

const Banner: FunctionComponent<BannerProps> = () => {
  return (
    <StyledBanner>
      <Flex
        direction={isMobile ? 'column' : 'row'}
        style={isMobile ? { marginBottom: '1rem' } : {}}
      >
        <Logo style={isMobile ? { marginBottom: '2rem' } : { marginRight: '1rem' }} />
        <Flex direction="column">
          <Title>Conduktor Platform is here! Take the next step.</Title>
          <Paragraph breakpoint={{ '@initial': 'initial', '@bp3': 'bp3' }}>
            Get everything that Desktop can do and much more with Conduktor Platform.
          </Paragraph>
        </Flex>
      </Flex>
      <Button
        href="https://www.conduktor.io/get-started?utm_source=docs&utm_medium=banner&utm_campaign=desk_inst"
        type="primary"
      >
        Try for free
      </Button>
    </StyledBanner>
  )
}

export default Banner
