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
            <h3 className={styles.CardTitle}>Get Started</h3>
            <p className={styles.CardParagraph}>
            Get started with Conduktor Console. The installation and configuration process takes only a few minutes.
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
              src="/assets/images/docs-get-started.png"
              alt="Conduktor Platform"
            />
          </a>
        </div>
      </Container>
    </div>
  )
}

export default GetStarted
