import { styled } from '@site/src/styles'

export const StyledSwitcherTrigger = styled('div', {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
})

export const triggerStyles = {
  color: '$purple9',
  cursor: 'pointer',
  fontWeight: '$slim',
  fontFamily: '$poly',
  lineHeight: '$fit',
  fontSize: 25,
  display: 'block',
  userSelect: 'none',
  marginTop: 1.5,
  marginLeft: 24,
}

export const Trigger = styled('button', {
  all: 'unset',
  ...triggerStyles,
  cursor: 'pointer',
  padding: '$space4',
  borderRadius: '$radius3',
  transition: 'background-color 200ms ease-in-out',
  marginLeft: `calc(24px - $space4)`,

  '&:hover, &:focus': {
    backgroundColor: '$purple3',
  },
})

export const TriggerIcon = styled('img', {
  marginLeft: '$space4',
})
