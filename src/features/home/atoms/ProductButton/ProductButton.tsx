import React from 'react';
import Link from "@docusaurus/Link";
import styles from './ProductButton.module.scss'

interface Props {
  icon: string;
  title: string;
  url: string;
}

const ProductButton: React.FunctionComponent<Props> = ({icon, title, url}) => {
  return (
    <Link to={url} className={styles.buttonWrapper}>
      <span className={styles.buttonIconWrapper}>
        <img src={icon} alt="Button icon" className={styles.buttonIcon}/>
      </span>
      {title}
    </Link>
  );
};

export default ProductButton;