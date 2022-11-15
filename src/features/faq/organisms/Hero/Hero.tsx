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
              Everything you need to know about the product and billing. Can't find the
              <br />
              answer you're looking for? Please chat to our friendly team.
            </p>
          </Container>
        </div>
      </GridBackground>
      <GradientMask startColor="transparent" endColor="#fff" top={0} />
    </section>
  )
}

export default Hero
