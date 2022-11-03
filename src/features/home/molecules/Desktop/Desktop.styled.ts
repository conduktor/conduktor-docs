import { styled } from '@site/src/styles'

export const StyledDesktop = styled('div', {
  padding: '$space10',
  border: '1px solid $mauve4',
  borderRadius: '$radius6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '$space14',
})

export const Content = styled('div', {})

export const Icon = styled('img', {
  marginRight: '$space6',
})

export const Title = styled('strong', {
  color: '$mauve12',
})

export const Paragraph = styled('p', {
  all: 'unset',
  color: '$mauve11',
})
