import { styled } from '@site/src/styles'

export const StyledBadge = styled('span', {
  backgroundColor: 'rgba(255, 187, 1, 0.17)',
  color: 'rgba(171, 83, 0, 0.98)',
  fontWeight: '$semi',
  fontSize: '$fontSize1',
  letterSpacing: '0.5px',
  padding: '$space2 $space2',
  lineHeight: '$fit',
  textTransform: 'uppercase',
  display: 'block',
  borderRadius: '$radius1',
  pointerEvents: 'none',
  userSelect: 'none',
})
