import Link from '@docusaurus/Link'
import { styled } from '@site/src/styles'
import { triggerStyles } from '../SwitcherTrigger/SwitcherTrigger.styled'

export const StyledSwitcherPlaceholder = styled('div', {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
})

export const Placeholder = styled(Link, {
  all: 'unset',
  textDecoration: 'none !important',
  ...triggerStyles,
})
