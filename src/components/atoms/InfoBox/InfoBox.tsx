import React from 'react'
import { InfoBoxContent, InfoBoxTitle, StyledInfoBox } from './InfoBox.styled'

interface InfoBoxProps {
  title?: string
  children: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
  type: 'info' | 'success' | 'warning' | 'danger'
}

const InfoBox: React.FunctionComponent<InfoBoxProps> = ({ title, children, type }) => {
  return (
    <StyledInfoBox type={type}>
      {title && <InfoBoxTitle>{title}</InfoBoxTitle>}
      <InfoBoxContent>{children}</InfoBoxContent>
    </StyledInfoBox>
  )
}

export default InfoBox
