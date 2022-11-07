import Link from '@docusaurus/Link'
import React from 'react'
import styles from './SwitcherPlaceholder.module.scss'

interface SwitcherPlaceholderProps {}

const SwitcherPlaceholder: React.FunctionComponent<SwitcherPlaceholderProps> = () => {
  return (
    <div className={styles.StyledSwitcherPlaceholder}>
      <Link className={styles.Placeholder} to="/">
        docs
      </Link>
    </div>
  )
}

export default SwitcherPlaceholder
