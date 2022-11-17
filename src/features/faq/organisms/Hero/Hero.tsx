import Container from '@site/src/components/atoms/Container'
import GradientMask from '@site/src/components/atoms/GradientMask/GradientMask'
import GridBackground from '@site/src/components/atoms/GridBackground/GridBackground'
import React from 'react'
import styles from './Hero.module.scss'

interface HeroProps {}

const Hero: React.FunctionComponent<HeroProps> = () => {
  return (
    <section className={styles.StyledHero}>
      <img
        className={styles.LightbeamVisual}
        src="/assets/visuals/lightBeams1.webp"
        alt="Light Beams"
      />
      <GridBackground>
        <div className={styles.ContentContainer}>
          <Container>
            <h1 className={styles.Heading}>Frequently asked questions</h1>
            <p className={styles.Paragraph}>
              Find answers to the most common questions we receive about Conduktor Platform.
              <br />
              Can't find what you're looking for? Get in touch with us
            </p>
          </Container>
        </div>
      </GridBackground>
      <GradientMask startColor="transparent" endColor="#fff" top={0} />
    </section>
  )
}

export default Hero
