import React from 'react';
import Link from "@docusaurus/Link";
import styles from "./UsecaseLink.module.scss";

interface Props {
  title: string;
  url: string;
}
const UsecaseLink: React.FunctionComponent<Props> = ({title, url}) => {
  return (
    <Link to={url} className={styles.buttonWrapper}>
      <span className={styles.buttonIconWrapper}>
        <img src={"/assets/svgs/common/chevron.svg"} alt="Chevron icon" className={styles.buttonIcon}/>
      </span>
      {title}
    </Link>
  );
};

export default UsecaseLink;