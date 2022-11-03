import { useLocation } from '@docusaurus/router'
import React from 'react'
import { StyledSwitcherTrigger, Trigger, TriggerIcon } from './SwitcherTrigger.styled'

interface SwitcherTriggerProps {
  onClick: () => void
}

const SwitcherTrigger: React.FunctionComponent<SwitcherTriggerProps> = ({ onClick }) => {
  const location = useLocation()

  return (
    <StyledSwitcherTrigger>
      <Trigger onClick={onClick}>
        {location.pathname.split('/')[2]}
        <TriggerIcon src="/assets/svgs/common/angleDown.svg" alt="Angle down icon" />
      </Trigger>
    </StyledSwitcherTrigger>
  )
}

export default SwitcherTrigger
