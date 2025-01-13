import Link from '@docusaurus/Link'
import Container from '@site/src/components/atoms/Container'
import React from 'react'
import Badge from '../../atoms/Badge'
import Heading from '../../atoms/Heading'
import { products, useCases } from './BrowseBy.constants'
import styles from './BrowseBy.module.scss'

interface BrowseBy {
  what: string
}

const BrowseBy: React.FunctionComponent<BrowseBy> = ({what}) => {
  let items = []
  if (what === 'Products') {
    items = products
  } else {
    items = useCases
  }

  return (
    <section className={styles.StyledGuides}>
      <Container>
        <Heading>Browse by {what}</Heading>
        <ul className={styles.List}>
          {items.map((item, itemIndex) => (
            <li className={styles.ListItem} key={itemIndex}>
              <span>{item.title}</span>
              <p>{item.description}</p>
              <ul>
                {item.items.map((item, itemIndex) => (
                  <strong className={styles.ListItemTitle}>
                    <span className={styles.ListItemArrow}>→</span>
                    <Link to={item[1]}>{item[0]}</Link>
                  </strong>
                ))}
                </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default BrowseBy
