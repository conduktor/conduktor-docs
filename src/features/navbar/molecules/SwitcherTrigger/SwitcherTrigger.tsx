import { useLocation } from '@docusaurus/router'
import useIsBrowser from '@docusaurus/useIsBrowser'
import React from 'react'
import { StyledSwitcherTrigger, Trigger, TriggerIcon } from './SwitcherTrigger.styled'

interface SwitcherTriggerProps {
  onClick: () => void
}

const SwitcherTrigger: React.FunctionComponent<SwitcherTriggerProps> = ({ onClick }) => {
  const location = useLocation()
  const isBrowser = useIsBrowser()
  const pathname = isBrowser
    ? location.pathname.split('/')[2]
      ? location.pathname.split('/')[2]
      : location.pathname.split('/')[1]
      ? location.pathname.split('/')[1]
      : 'platform'
    : undefined

  return (
    <StyledSwitcherTrigger>
      <Trigger onClick={onClick}>
        {pathname}
        <TriggerIcon src="/assets/svgs/common/angleDown.svg" alt="Angle down icon" />
      </Trigger>
    </StyledSwitcherTrigger>
  )
}

export default SwitcherTrigger
