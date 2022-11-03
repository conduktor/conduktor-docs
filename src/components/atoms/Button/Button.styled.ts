import { styled } from '@site/src/styles'

export const StyledButton = styled('a', {
  all: 'unset',
  cursor: 'pointer',
  backgroundColor: '$purple9',
  color: '#fff',
  borderRadius: '$radius2',
  fontWeight: '$bold',
  letterSpacing: '-0.15px',
  lineHeight: '$button',
  height: 40,
  padding: '0 $space9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none !important',
  transition: 'background-color 200ms ease-in-out',

  '&:hover': {
    color: '#fff',
    backgroundColor: '$purple10',
  },
})
