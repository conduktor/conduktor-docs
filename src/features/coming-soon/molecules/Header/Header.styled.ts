import { styled } from '@site/src/styles'

export const StyledHeader = styled('div', {
  marginTop: '$space6 !important',
  marginBottom: '$space9',
})

export const Icon = styled('img', {
  marginRight: '$space9',
  height: 96,
  width: 96,
})

export const Title = styled('h1', {
  all: 'unset',
  fontSize: '$fontSize9',
  fontWeight: '$heavy',
  lineHeight: '$fit',
  fontFamily: '$poly',
})

export const Badge = styled('span', {
  textTransform: 'uppercase',
  backgroundColor: 'rgba(255, 187, 1, 0.17)',
  color: 'rgba(171, 83, 0, 0.98)',
  fontSize: 10,
  fontWeight: '$semi',
  lineHeight: '$fit',
  borderRadius: '$radius1',
  pointerEvents: 'none',
  userSelect: 'none',
  letterSpacing: '0.5px',
  padding: '0.25rem',
  width: 'fit-content',
  display: 'block',
  marginBottom: '$space4',
})
