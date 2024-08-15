import { useLocation } from '@docusaurus/router'
import useIsBrowser from '@docusaurus/useIsBrowser'
import useKeyCombination from '@site/src/hooks/useKeyCombination'
import React from 'react'
import SwitcherContainer from '../../molecules/SwitcherContainer'
import Placeholder from '../../molecules/SwitcherPlaceholder'
import SwitcherTrigger from '../../molecules/SwitcherTrigger/SwitcherTrigger'
import { ANIMATION_DURATION } from './Switcher.constants'
import { StyledSwitcher } from './Switcher.styled'

interface SwitcherProps {}

const Switcher: React.FunctionComponent<SwitcherProps> = () => {
  const location = useLocation()
  const isBrowser = useIsBrowser()
  const isHome = isBrowser ? location.pathname === '/' : true
  const isChangelog = isBrowser ? location.pathname.includes('/changelog') : false
  const [isOpened, setIsOpened] = React.useState<boolean>(false)
  const [fade, setFade] = React.useState<'in' | 'out'>('in')

  const handleClose = () => {
    setFade('out')
    setTimeout(() => {
      setIsOpened(false)
      setFade('in')
    }, ANIMATION_DURATION)
  }

  useKeyCombination({
    keys: ['Slash'],
    metaKey: true,
    callback: () => {
      setIsOpened(!isOpened)
    },
  })

  React.useEffect(() => {
    return () => {
      setIsOpened(false)
      setFade('in')
    }
  }, [])

  return (
    <StyledSwitcher>
      {(isHome || isChangelog) ? (
        <Placeholder />
      ) : (
        <SwitcherTrigger onClick={() => (isOpened ? handleClose() : setIsOpened(true))} />
      )}
      {!isHome && isOpened && <SwitcherContainer fade={fade} handleClose={handleClose} />}
    </StyledSwitcher>
  )
}

export default Switcher
