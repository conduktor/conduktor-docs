import Button from '@site/src/components/atoms/Button'
import React from 'react'
import Container from '../../../../components/atoms/Container'
import {
  Card,
  CardContent,
  CardParagraph,
  CardTitle,
  PlatformVisual,
  PlatformVisualContainer,
  StyledGetStarted,
} from './GetStarted.styled'

interface GetStartedProps {}

const GetStarted: React.FunctionComponent<GetStartedProps> = () => {
  return (
    <StyledGetStarted
      breakpoint={{ '@initial': 'initial', '@bp3': 'bp3', '@bp4': 'bp4', '@bp5': 'bp5' }}
    >
      <Container>
        <Card breakpoint={{ '@initial': 'initial', '@bp3': 'bp3' }}>
          <CardContent breakpoint={{ '@initial': 'initial', '@bp3': 'bp3' }}>
            <CardTitle>Get Started</CardTitle>
            <CardParagraph>
              Get everything that Desktop can do and much more with Conduktor Platform. Available in
              SaaS and Docker form. Need a desktop app? Carry on below.
            </CardParagraph>
            <Button
              id="download-get-started"
              href="https://www.conduktor.io/get-started"
              width="fit-content"
            >
              Try for free
            </Button>
          </CardContent>
          <PlatformVisualContainer
            href="https://www.conduktor.io/get-started"
            id="visual-download-get-started"
          >
            <PlatformVisual
              src="/assets/images/platform-download.png"
              alt="Conduktor Platform"
              breakpoint={{ '@initial': 'initial', '@bp3': 'bp3' }}
            />
          </PlatformVisualContainer>
        </Card>
      </Container>
    </StyledGetStarted>
  )
}

export default GetStarted
