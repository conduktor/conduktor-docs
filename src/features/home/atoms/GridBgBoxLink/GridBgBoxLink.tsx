import React from 'react'
import styles from './GridBgBoxLink.module.scss'
import GridHalfVisibleBackground
  from "@site/src/features/home/atoms/GridHalfVisibleBackground/GridHalfVisibleBackground";

interface BadgeProps {
  icon: string;
  title: string;
  description: string;
}

const GridBgBoxLink: React.FunctionComponent<BadgeProps> = ({ icon, title, description }) => {
  return (
    <div className={styles.StyledBoxLink}>
      <GridHalfVisibleBackground/>
      <div className={styles.LinkIconWrapper}>
        <img className={styles.LinkIcon} src={icon} alt={title}/>
      </div>
      <div>
        <h4 className={styles.LinkTitle}>{title}</h4>
        <p className={styles.LinkDescription}>{description}</p>
      </div>
    </div>
  )
}

export default GridBgBoxLink
