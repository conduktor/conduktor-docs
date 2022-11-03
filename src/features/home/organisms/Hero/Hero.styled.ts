import { styled } from '@site/src/styles'
import { fadeIn } from './../../../../styles/keyframes'

export const StyledHero = styled('section', {
  position: 'relative',
})

export const LightbeamVisual = styled('img', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  animation: `${fadeIn} 300ms 0ms both`,
})

export const ContentContainer = styled('div', {
  padding: '$space16 0',
  zIndex: 1,
  position: 'relative',
})

export const Heading = styled('h1', {
  fontSize: '$fontSize14',
  fontWeight: '$semi',
  color: '$mauve12',
  lineHeight: '$fit',
  textAlign: 'center',
  display: 'block',
  marginBottom: '$space6',
})

export const Paragraph = styled('p', {
  fontSize: '$fontSize5',
  color: '$mauve11',
  textAlign: 'center',
  display: 'block',
  marginBottom: '$space10',
})
