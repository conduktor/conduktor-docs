import Tree from '@theme-original/TOCItems/Tree'
import React, { useRef } from 'react'
import { usePresetStates, useTogglerState } from './Tree.hooks'
import styles from './tree.module.scss'

export default function TreeWrapper(props) {
  const ref = useRef()

  useTogglerState(ref)
  usePresetStates(ref)

  return (
    <div ref={ref}>
      <strong className={styles.title}>Quick nav</strong>
      <Tree {...props} />
    </div>
  )
}
