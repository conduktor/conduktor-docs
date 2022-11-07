import Button from '@site/src/components/atoms/Button'
import React from 'react'
import styles from './Desktop.module.scss'

interface DesktopProps {}

const Desktop: React.FunctionComponent<DesktopProps> = () => {
  return (
    <div className={styles.StyledDesktop}>
      <div className={styles.Content}>
        <img className={styles.Icon} src="/assets/svgs/desktop.svg" alt="Conduktor Desktop" />
        <div className={styles.TitleContainer}>
          <strong className={styles.Title}>Looking for Conduktor Desktop documentation?</strong>
          <p className={styles.Paragraph}>All the features of our legacy product, documented.</p>
        </div>
      </div>
      <Button to="/desktop">Read now</Button>
    </div>
  )
}

export default Desktop
