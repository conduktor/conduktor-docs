import Container from '@site/src/components/atoms/Container'
import GradientMask from '@site/src/components/atoms/GradientMask/GradientMask'
import GridBackground from '@site/src/components/atoms/GridBackground/GridBackground'
import SearchInput from '@site/src/components/molecules/SearchInput'
import React from 'react'
import { ContentContainer, Heading, LightbeamVisual, Paragraph, StyledHero } from './Hero.styled'

interface HeroProps {}

const Hero: React.FunctionComponent<HeroProps> = () => {
  return (
    <StyledHero>
      <LightbeamVisual src="/assets/visuals/lightBeams1.webp" alt="Light Beams" />
      <GridBackground>
        <ContentContainer>
          <Container>
            <Heading>Documentation</Heading>
            <Paragraph>Guides and tutorials for everything Conduktor</Paragraph>
            <SearchInput />
          </Container>
        </ContentContainer>
      </GridBackground>
      <GradientMask startColor="transparent" endColor="#fff" top={0} />
    </StyledHero>
  )
}

export default Hero
