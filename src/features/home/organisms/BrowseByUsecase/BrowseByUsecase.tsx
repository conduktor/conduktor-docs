import Container from '@site/src/components/atoms/Container'
import React from 'react'
import { useCases } from './BrowseByUsecase.constants'
import styles from './BrowseByUsecase.module.scss'
import UsecaseLink from "@site/src/features/home/atoms/UsecaseLink/UsecseLink";
import WrappedHeading from "@site/src/features/home/atoms/WrappedHeading";

const BrowseByUsecase = () => {

  return (
    <section className={styles.StyledGuides}>
      <Container>
        <WrappedHeading>
          Browse by use case
        </WrappedHeading>
        <ul className={styles.List}>
          {useCases.map((item, itemIndex) => (
            <li className={styles.ListItemWrapper} key={itemIndex}>
              <div className={styles.ListItemLeft}>
                <span className={styles.Title}>{item.title}</span>
                <p className={styles.Description}>{item.description}</p>
              </div>
              <ul className={styles.ButtonsList}>
                {item.items.map((linkItem, itemIndex) => (
                  <UsecaseLink
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

export default BrowseByUsecase
