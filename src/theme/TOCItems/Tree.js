import Tree from '@theme-original/TOCItems/Tree'
import React from 'react'
import styles from './tree.module.scss'

export default function TreeWrapper(props) {
  return (
    <>
      <strong className={styles.title}>Quick nav</strong>
      <Tree {...props} />
    </>
  )
}
