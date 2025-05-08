import ToggleSwitch from '@site/src/components/atoms/ToggleSwitch'
import useQuickNavStore from '@site/src/theme/TOCItems/Tree.store.ts'
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs'
import React from 'react'
import styles from './DocBreadcrumbs.module.scss'

export default function DocBreadcrumbsWrapper(props) {
  const quickNavState = useQuickNavStore(state => state.state)
  const setQuickNavState = useQuickNavStore(state => state.setState)

  return (
    <div className={styles.container}>
      <DocBreadcrumbs {...props} />
      <div className={styles.switchContainer}>
        On this page
        <ToggleSwitch
          defaultChecked={quickNavState}
          checked={quickNavState}
          onChange={e => setQuickNavState(e.target.checked)}
        />
      </div>
    </div>
  )
}
