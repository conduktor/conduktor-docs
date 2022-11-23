import React from 'react'
import styles from './Heading.module.scss'

interface HeadingProps {
  children: React.ReactNode
}

const Heading: React.FunctionComponent<HeadingProps> = ({ children }) => {
  return <h2 className={styles.StyledHeading}>{children}</h2>
}

export default Heading
