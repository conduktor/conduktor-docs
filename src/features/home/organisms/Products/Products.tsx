import Link from '@docusaurus/Link'
import Button from '@site/src/components/atoms/Button'
import Container from '@site/src/components/atoms/Container'
import React from 'react'
import Badge from '../../atoms/Badge'
import Heading from '../../atoms/Heading'
import { items } from './Products.constants'
import styles from './Products.module.scss'

interface ProductsProps {}

const Products: React.FunctionComponent<ProductsProps> = () => {
  return (
    <section>
      <Container>
        <div className={styles.HeadingContainer}>
          <Heading>Browse by product</Heading>
          <Button id="home-get-started" href="https://www.conduktor.io/get-started" type="gradient">
            Get Started
          </Button>
        </div>
        <ul className={styles.List}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className={styles.ListItem}>
              <Link to={item.to} className={styles.ListItemLink}>
                <div className={styles.ListVisual}>
                  <img className={styles.ListVisualImage} src={item.icon} alt={item.name} />
                </div>
                <div className={styles.ListItemNameContainer}>
                  <div className={styles.ListItemNameWrapper}>
                    <strong className={styles.ListItemName}>{item.name}</strong>
                    {item.comingSoon ? <Badge>soon</Badge> : <span></span>}
                    {item.legacy ? <Badge type="legacy">legacy</Badge> : <span></span>}
                  </div>
                  <p className={styles.ListItemDescription}>{item.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default Products
