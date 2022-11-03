import React from 'react'
import { Placeholder, StyledSwitcherPlaceholder } from './SwitcherPlaceholder.styled'

interface SwitcherPlaceholderProps {}

const SwitcherPlaceholder: React.FunctionComponent<SwitcherPlaceholderProps> = () => {
  return (
    <StyledSwitcherPlaceholder>
      <Placeholder to="/">docs</Placeholder>
    </StyledSwitcherPlaceholder>
  )
}

export default SwitcherPlaceholder
