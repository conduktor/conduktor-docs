import React from 'react'
import { DotOne, DotThree, DotTwo, Wrapper } from './SpinnerDots.styled'

interface SpinnerDotsProps {
  type: 'primary' | 'white'
  size: 8 | 16 | 32
}

const SpinnerDots: React.FunctionComponent<SpinnerDotsProps> = ({ type, size }) => {
  return (
    <Wrapper>
      <DotOne type={type} size={size} />
      <DotTwo type={type} size={size} />
      <DotThree type={type} size={size} />
    </Wrapper>
  )
}

export default SpinnerDots
