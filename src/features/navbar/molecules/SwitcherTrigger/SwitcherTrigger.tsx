import { useLocation } from '@docusaurus/router'
import useIsBrowser from '@docusaurus/useIsBrowser'
import { items as ProductsItems } from '@site/src/features/home/organisms/Products/Products.constants'
import React from 'react'
import { StyledSwitcherTrigger, Trigger, TriggerIcon } from './SwitcherTrigger.styled'

interface SwitcherTriggerProps {
  onClick: () => void
}

const getPathName = (pathname: string) => {
  const paths = ProductsItems.reduce(function (a, b) {
    return a + ['', ', '][+!!a.length] + b.to
  }, '')
    .split(',')
    .map(part => part.trim())
  const parts = pathname.split('/')
  const path = `/${parts[1]}/${parts[2]}`

  if (paths.includes(path)) return parts[2].replace('-', ' ')
  else if (parts[1] === 'desktop') return 'desktop'

  return 'platform'
}

const SwitcherTrigger: React.FunctionComponent<SwitcherTriggerProps> = ({ onClick }) => {
  const location = useLocation()
  const isBrowser = useIsBrowser()
  const pathname = isBrowser ? getPathName(location.pathname) : 'platform'

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
