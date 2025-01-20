import Link from '@docusaurus/Link'
import Container from '@site/src/components/atoms/Container'
import React from 'react'
import { items } from './Products.constants'
import styles from './Products.module.scss'
import GridBgBoxLink from "@site/src/features/home/atoms/GridBgBoxLink";

interface ProductsProps {}

const Products: React.FunctionComponent<ProductsProps> = () => {
  return (
    <section>
      <Container>
        <ul className={styles.List}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className={styles.ListItem}>
              <Link to={item.to} className={styles.ListItemLink}>
                <GridBgBoxLink icon={item.icon} title={item.name} description={item.description} />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default Products
