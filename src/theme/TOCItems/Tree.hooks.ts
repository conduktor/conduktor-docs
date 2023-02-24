import { useLocation } from '@docusaurus/router'
import { useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { hiddenByDefaultList } from './Tree.constants'
import useQuickNavStore from './Tree.store.ts'

export const useTogglerState = ref => {
  const isEnabled = useQuickNavStore(state => state.state)

  useEffect(() => {
    useQuickNavState(ref, isEnabled)
  }, [isEnabled])
}

export const usePresetStates = ref => {
  const location = useLocation()
  const setQuickNavState = useQuickNavStore(state => state.setState)

  useEffect(() => {
    const state = !hiddenByDefaultList.includes(location.pathname)
    setQuickNavState(state)
    useQuickNavState(ref, state)
  }, [location.pathname])
}

export const useQuickNavState = (ref, isEnabled) => {
  if (!ref.current) return

  const element = ref.current
  const parentElement = element.parentElement.parentElement
  const parentElementSibling = parentElement.previousElementSibling

  if (parentElement) {
    if (isEnabled) {
      parentElement.style.display = 'block'
    } else parentElement.style.display = 'none'
  }
  if (parentElementSibling)
    parentElementSibling.setAttribute(
      'style',
      `max-width: ${
        isEnabled ? (isMobile ? 100 : 75) : 100
      }% !important; transition: max-width 200ms ease-in-out;`
    )
}
