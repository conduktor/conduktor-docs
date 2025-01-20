import Container from '@site/src/components/atoms/Container'
import React from 'react'
import Heading from '../../atoms/Heading'
import { products } from './BrowseByProducts.constants'
import styles from './BrowseByProducts.module.scss'
import ProductButton from "@site/src/features/home/atoms/ProductButton";

const BrowseByProducts = () => {

  return (
    <section className={styles.StyledGuides}>
      <Container>
        <Heading>Browse by Products</Heading>
        <ul className={styles.List}>
          {products.map((item, itemIndex) => (
            <li className={styles.ListItemWrapper} key={itemIndex}>
              <div className={styles.ListItemLeft}>
                <span className={styles.Title}>{item.title}</span>
                <p className={styles.Description}>{item.description}</p>
              </div>
              <ul className={styles.ButtonsList}>
                {item.items.map((linkItem, itemIndex) => (
                  <ProductButton
                    icon={linkItem[2]}
                    key={itemIndex}
                    title={linkItem[0]}
                    url={linkItem[1]}
                  />
                ))}
                </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default BrowseByProducts
