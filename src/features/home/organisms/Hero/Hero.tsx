import Button from '@site/src/components/atoms/Button'
import Container from '@site/src/components/atoms/Container'
import GradientMask from '@site/src/components/atoms/GradientMask/GradientMask'
import GridBackground from '@site/src/components/atoms/GridBackground/GridBackground'
import SearchInput from '@site/src/components/molecules/SearchInput'
import React from 'react'
import styles from './Hero.module.scss'

interface HeroProps {}

const Hero: React.FunctionComponent<HeroProps> = () => {
  return (
    <section className={styles.StyledHero}>
      <div className={styles.ContentContainer}>
        <Container>
          <div className={styles.HeroContent}>
            <p className={styles.HeroContentTitle}>Get Started with Conduktor</p>
            <p className={styles.Paragraph}>
              Learn how to install Conduktor and explore our Enterprise Data Management Platform For
              Streaming.
            </p>
            <div className={styles.ButtonContainer}>
              <Button to="/platform/category/get-started" type="primary" hasArrow>
                Get Started
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

export default Hero
