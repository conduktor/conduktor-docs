import { useLocation } from '@docusaurus/router'
import useIsBrowser from '@docusaurus/useIsBrowser'
import { useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { hiddenByDefaultList } from './Tree.constants'
import useQuickNavStore from './Tree.store.ts'

export const useTogglerState = ref => {
  const isEnabled = useQuickNavStore(state => state.state)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const parentElement = element.parentElement.parentElement
    const parentElementSibling = parentElement.previousElementSibling

    if (parentElement) {
      if (isEnabled) {
        setTimeout(() => {
          parentElement.style.display = 'block'
        }, 200)
      } else parentElement.style.display = 'none'
    }
    if (parentElementSibling)
      parentElementSibling.setAttribute(
        'style',
        `max-width: ${
          isEnabled ? (isMobile ? 100 : 75) : 100
        }% !important; transition: max-width 200ms ease-in-out;`
      )
  }, [isEnabled])
}

export const usePresetStates = () => {
  const isBrowser = useIsBrowser()
  const location = useLocation()
  const setQuickNavState = useQuickNavStore(state => state.setState)

  useEffect(() => {
    isBrowser && setQuickNavState(!hiddenByDefaultList.includes(location.pathname))
  }, [location.pathname])
}
