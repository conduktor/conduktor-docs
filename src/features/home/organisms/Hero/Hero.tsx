import Button from '@site/src/components/atoms/Button'
import Container from '@site/src/components/atoms/Container'
import GradientMask from '@site/src/components/atoms/GradientMask/GradientMask'
import GridHalfVisibleBackground from '../../atoms/GridHalfVisibleBackground/GridHalfVisibleBackground'
import SearchInput from '@site/src/components/molecules/SearchInput'
import React from 'react'
import styles from './Hero.module.scss'
import Flex from "@site/src/components/atoms/Flex";

interface HeroProps {
}

const Hero: React.FunctionComponent<HeroProps> = () => {
  return (
    <section className={styles.StyledHero}>
      <div className={styles.ContentContainer}>
        <Container>
          <div className={styles.HeroContent}>
            <div className={styles.HeroLeftContent}>
              <p className={styles.HeroContentTitle}>Get Started with Conduktor</p>
              <p className={styles.HeroContentSubtitle}>Learn how to install Conduktor and explore our Enterprise Data Management Platform For
                Streaming.</p>
              <div className={styles.ButtonContainer}>
                <Button to="/platform/category/get-started" type="brand">
                  Get started
                </Button>
                <Button to="/platform/category/get-started" type="colorless">
                  Start with proxy
                </Button>
              </div>
            </div>
            <div className={styles.HeroRightContent}>
              <div className={styles.GridBackground}/>
              <img className={styles.HeroRightImage} src="/assets/images/home-hero-charts.png" alt="charts image"/>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

export default Hero
