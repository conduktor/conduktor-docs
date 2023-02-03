import React, { FunctionComponent } from 'react'
import styles from './ToggleSwitch.module.scss'

interface ToggleSwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const ToggleSwitch: FunctionComponent<ToggleSwitchProps> = ({
  defaultChecked,
  checked,
  onChange,
}) => {
  return (
    <label className={styles.label}>
      <input
        className={styles.input}
        type="checkbox"
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.slider} />
    </label>
  )
}

export default ToggleSwitch
