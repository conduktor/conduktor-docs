import React from 'react';
import styles from './WrappedHeading.module.scss'
import Heading from "@site/src/features/home/atoms/Heading";

interface Props {
  children: React.ReactNode;
}
const WrappedHeading: React.FunctionComponent<Props> = ({children}) => {
  return (
    <div className={styles.HeadingWrapper}>
      <Heading>{children}</Heading>
    </div>
  );
};

export default WrappedHeading;