import WrappedHeading from "@site/src/features/home/atoms/WrappedHeading";
import React from "react";
import { items } from './UsefulLinks.constants'
import Container from "@site/src/components/atoms/Container";
import styles from "@site/src/features/home/organisms/Products/Products.module.scss";
import Link from "@docusaurus/Link";
import GridBgBoxLink from "@site/src/features/home/atoms/GridBgBoxLink";

const UsefulLinks = () => {
  return (
    <section>
      <Container>
        <WrappedHeading>
          Useful links
        </WrappedHeading>
        <ul className={styles.List}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className={styles.ListItem}>
              <Link to={item.to} className={styles.ListItemLink}>
                <GridBgBoxLink icon={item.icon} title={item.name} description={item.description}/>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
)
  ;
};

export default UsefulLinks;