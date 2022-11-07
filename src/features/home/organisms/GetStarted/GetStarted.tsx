import Button from '@site/src/components/atoms/Button'
import React from 'react'
import Container from '../../../../components/atoms/Container'
import styles from './GetStarted.module.scss'

interface GetStartedProps {}

const GetStarted: React.FunctionComponent<GetStartedProps> = () => {
  return (
    <div className={styles.StyledGetStarted}>
      <Container>
        <div className={styles.Card}>
          <div className={styles.CardContent}>
            <h2 className={styles.CardTitle}>Get Started</h2>
            <p className={styles.CardParagraph}>
              Get everything that Desktop can do and much more with Conduktor Platform. Available in
              SaaS and Docker form. Need a desktop app? Carry on below.
            </p>
            <Button
              id="download-get-started"
              href="https://www.conduktor.io/get-started"
              width="fit-content"
            >
              Try for free
            </Button>
          </div>
          <a
            className={styles.PlatformVisualContainer}
            href="https://www.conduktor.io/get-started"
            id="visual-download-get-started"
          >
            <img
              className={styles.PlatformVisual}
              src="/assets/images/platform-download.png"
              alt="Conduktor Platform"
            />
          </a>
        </div>
      </Container>
    </div>
  )
}

export default GetStarted
