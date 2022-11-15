import { keyframes, styled } from '../../../styles'

export const Wrapper = styled('div', {
  display: 'inline-flex',
  verticalAlign: 'middle',
})

export const Dot = styled('div', {
  borderRadius: '$round',
  color: 'inherit',
  margin: '0 $space2',

  variants: {
    type: {
      primary: {
        backgroundColor: '$purple9',
      },
      white: {
        backgroundColor: '#fff',
      },
    },
    size: {
      8: {
        width: 8,
        height: 8,
      },
      16: {
        width: 16,
        height: 16,
      },
      32: {
        width: 32,
        height: 32,
      },
    },
  },
})

export const bounce = keyframes({
  '0%': { opacity: 1 },
  '60%': { opacity: 0 },
  '100%': { opacity: 1 },
})

export const DotOne = styled(Dot, {
  animation: `${bounce} 1s infinite`,
  animationDelay: '0.1s',
})

export const DotTwo = styled(Dot, {
  animation: `${bounce} 1s infinite`,
  animationDelay: '0.3s',
})

export const DotThree = styled(Dot, {
  animation: `${bounce} 1s infinite`,
  animationDelay: '0.5s',
})
