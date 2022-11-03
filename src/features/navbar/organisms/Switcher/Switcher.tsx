import React from 'react'
import SwitcherContainer from '../molecules/SwitcherContainer'
import Placeholder from '../molecules/SwitcherPlaceholder'
import SwitcherTrigger from '../molecules/SwitcherTrigger/SwitcherTrigger'
import { StyledSwitcher } from './Switcher.styled'

interface SwitcherProps {}

const Switcher: React.FunctionComponent<SwitcherProps> = () => {
  const isHome = location.pathname === '/'
  const [isOpened, setIsOpened] = React.useState<boolean>(false)

  return (
    <StyledSwitcher>
      {isHome ? <Placeholder /> : <SwitcherTrigger onClick={() => setIsOpened(!isOpened)} />}
      {!isHome && isOpened && <SwitcherContainer />}
    </StyledSwitcher>
  )
}

export default Switcher
