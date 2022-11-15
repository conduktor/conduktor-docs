import React from 'react'
import { Feature, FeatureIcon, StyledFeatures } from './Features.styled'

interface FeaturesProps {
  items: string[]
}

const Features: React.FunctionComponent<FeaturesProps> = ({ items }) => {
  return (
    <StyledFeatures>
      {items.map((item, index) => (
        <Feature key={index}>
          <FeatureIcon src="/assets/svgs/common/checkmark.svg" alt="checkmark" />
          {item}
        </Feature>
      ))}
    </StyledFeatures>
  )
}

export default Features
