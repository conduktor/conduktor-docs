import React from 'react'
import { StyledGradientMask } from './GradientMask.styled'

interface GradientMaskProps {
  startColor?: string
  endColor?: string
  startOffset?: string
  endOffset?: string
  startPosition?: string
  endPosition?: string
  top?: string | number
  direction?: 'vertical' | 'horizontal'
}

const GradientMask: React.FunctionComponent<GradientMaskProps> = ({
  startColor = 'transparent',
  endColor = 'transparent',
  startOffset = '15%',
  endOffset = '75%',
  startPosition = '0%',
  endPosition = '100%',
  top = 'unset',
  direction = 'vertical',
}) => {
  return (
    <StyledGradientMask
      css={{
        top,
        backgroundImage:
          direction === 'vertical'
            ? `linear-gradient(to bottom, ${startColor} ${startPosition}, rgba(0, 0, 0, 0) ${startOffset}, rgba(0, 0, 0, 0) ${endOffset}, ${endColor} ${endPosition})`
            : `linear-gradient(to right, ${startColor} ${startPosition}, rgba(0, 0, 0, 0) ${startOffset}, rgba(0, 0, 0, 0) ${endOffset}, ${endColor} ${endPosition})`,
      }}
    />
  )
}

export default GradientMask
