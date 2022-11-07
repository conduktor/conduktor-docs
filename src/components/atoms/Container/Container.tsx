import React from 'react'
import styles from './Container.module.scss'

interface ContainerProps {
  children: React.ReactNode | React.ReactNode[]
}

const Container: React.FunctionComponent<ContainerProps> = ({ children }) => {
  return <div className={styles.StyledContainer}>{children}</div>
}

export default Container
