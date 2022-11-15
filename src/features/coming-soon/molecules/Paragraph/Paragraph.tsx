import React from 'react'
import { StyledParagraph } from './Paragraph.styled'

interface ParagraphProps {
  children: React.ReactNode
}

const Paragraph: React.FunctionComponent<ParagraphProps> = ({ children }) => {
  return <StyledParagraph>{children}</StyledParagraph>
}

export default Paragraph
