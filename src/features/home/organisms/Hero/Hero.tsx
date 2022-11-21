import Link from '@docusaurus/Link'
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
      <img
        className={styles.LightbeamVisual}
        src="/assets/visuals/lightBeams1.webp"
        alt="Light Beams"
      />
      <GridBackground>
        <div className={styles.ContentContainer}>
          <Container>
            <h1 className={styles.Heading}>Documentation</h1>
            <p className={styles.Paragraph}>Guides and tutorials for everything Conduktor</p>
            <Link to="/platform" className={styles.Link}>
              Introduction →
            </Link>
            <SearchInput />
          </Container>
        </div>
      </GridBackground>
      <GradientMask startColor="transparent" endColor="#fff" top={0} />
    </section>
  )
}

export default Hero
