import Link from '@docusaurus/Link'
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
        <ul className={styles.List}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className={styles.ListItem}>
              <Link to={item.to} className={styles.ListItemLink}>
                <div className={styles.ListVisual}>
                  <img className={styles.ListVisualImage} src={item.icon} alt={item.name} />
                  <div>
                    <strong className={styles.ListItemName}>{item.name}</strong>
                    <p className={styles.ListItemDescription}>{item.description}</p>
                  </div>
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
