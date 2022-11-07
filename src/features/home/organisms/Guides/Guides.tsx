import Container from '@site/src/components/atoms/Container'
import React from 'react'
import Heading from '../../atoms/Heading'
import Desktop from '../../molecules/Desktop'
import { items } from './Guides.constants'
import styles from './Guides.module.scss'

interface GuidesProps {}

const Guides: React.FunctionComponent<GuidesProps> = () => {
  return (
    <section className={styles.StyledGuides}>
      <Container>
        <Heading>Deployment guides</Heading>
        <ul className={styles.List}>
          {items.map((item, itemIndex) => (
            <li className={styles.ListItem} key={itemIndex}>
              <a className={styles.ListItemLink} href={item.href}>
                <img src={item.icon} alt={item.title} />
                <strong className={styles.ListItemTitle}>
                  {item.title}
                  <img
                    className={styles.ListItemTitleArrow}
                    src="/assets/svgs/common/arrowRight.svg"
                    alt="Arrow right"
                  />
                </strong>
              </a>
            </li>
          ))}
        </ul>
        <Desktop />
      </Container>
    </section>
  )
}

export default Guides
