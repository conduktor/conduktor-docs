import React from 'react'
import { socialIconsItems } from './SocialIcons.constants'
import { SocialItem, StyledSocialIcons } from './SocialIcons.styled'

interface SocialIconsProps {}

const SocialIcons: React.FunctionComponent<SocialIconsProps> = () => {
  return (
    <StyledSocialIcons>
      {socialIconsItems.map((item, index) => (
        <SocialItem
          key={index}
          href={item.href}
          title={item.title}
          target="_blank"
          rel="noreferrer"
        >
          {item.icon}
        </SocialItem>
      ))}
    </StyledSocialIcons>
  )
}

export default SocialIcons
