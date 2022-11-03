import useKeyCombination from '@site/src/hooks/useKeyCombination'
import useOutsideClick from '@site/src/hooks/useOutsideClick'
import React from 'react'
import SwitcherContainer from '../../molecules/SwitcherContainer'
import Placeholder from '../../molecules/SwitcherPlaceholder'
import SwitcherTrigger from '../../molecules/SwitcherTrigger/SwitcherTrigger'
import { ANIMATION_DURATION } from './Switcher.constants'
import { StyledSwitcher } from './Switcher.styled'

interface SwitcherProps {}

const Switcher: React.FunctionComponent<SwitcherProps> = () => {
  const isHome = location.pathname === '/'
  const [isOpened, setIsOpened] = React.useState<boolean>(false)
  const [fade, setFade] = React.useState<'in' | 'out'>('in')
  const containerRef = React.useRef<HTMLInputElement>(null)

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

  useOutsideClick({
    parentRef: containerRef,
    callback: handleClose,
  })

  React.useEffect(() => {
    return () => {
      setIsOpened(false)
      setFade('in')
    }
  }, [])

  return (
    <StyledSwitcher>
      {isHome ? (
        <Placeholder />
      ) : (
        <SwitcherTrigger onClick={() => (isOpened ? handleClose() : setIsOpened(true))} />
      )}
      {!isHome && isOpened && (
        <SwitcherContainer ref={containerRef} fade={fade} handleClose={handleClose} />
      )}
    </StyledSwitcher>
  )
}

export default Switcher
