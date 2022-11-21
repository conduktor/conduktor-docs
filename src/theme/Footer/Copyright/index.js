import SocialIcons from '@site/src/features/footer/molecules/SocialIcons'
import Copyright from '@theme-original/Footer/Copyright'
import React from 'react'
import styles from './copyright.module.scss'

export default function CopyrightWrapper(props) {
  return (
    <>
      <div className={styles.container}>
        <Copyright {...props} />
        <SocialIcons />
      </div>
    </>
  )
}
