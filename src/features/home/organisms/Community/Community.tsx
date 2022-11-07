import Container from '@site/src/components/atoms/Container'
import React from 'react'
import Heading from '../../atoms/Heading'
import { items } from './Community.constants'
import styles from './Community.module.scss'

interface CommunityProps {}

const Community: React.FunctionComponent<CommunityProps> = () => {
  return (
    <section className={styles.StyledCommunity}>
      <Container>
        <Heading>Join the community</Heading>
        <ul className={styles.List}>
          {items.map((item, itemIndex) => (
            <li className={styles.ListItem} key={itemIndex}>
              <a className={styles.ListItemLink} href={item.href} target="_blank">
                <div className={styles.ListItemVisual}>
                  <img src={item.icon} alt={item.title} />
                </div>
                <div className={styles.ListItemContent}>
                  <strong className={styles.ListItemTitle}>{item.title}</strong>
                  <p className={styles.ListItemParagraph}>{item.description}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default Community
