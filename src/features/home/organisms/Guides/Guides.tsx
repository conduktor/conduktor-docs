import Link from '@docusaurus/Link'
import Container from '@site/src/components/atoms/Container'
import React from 'react'
import Badge from '../../atoms/Badge'
import Heading from '../../atoms/Heading'
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
              <Link className={styles.ListItemLink} to={item.to} data-disabled={item.comingSoon}>
                <span className={styles.ListItemTitleContainer}>
                  <img src={item.icon} alt={item.title} />
                  <strong className={styles.ListItemTitle}>
                    {item.title}

                    <img
                      className={styles.ListItemTitleArrow}
                      src="/assets/svgs/common/arrowRight.svg"
                      alt="Arrow right"
                    />
                  </strong>
                </span>

                {item.comingSoon && <Badge>Soon</Badge>}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default Guides
