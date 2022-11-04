import Container from '@site/src/components/atoms/Container'
import React from 'react'
import Heading from '../../atoms/Heading'
import { items } from './Community.constants'
import {
  List,
  ListItem,
  ListItemContent,
  ListItemLink,
  ListItemParagraph,
  ListItemTitle,
  ListItemVisual,
  ListItemVisualIcon,
  StyledCommunity,
} from './Community.styled'

interface CommunityProps {}

const Community: React.FunctionComponent<CommunityProps> = () => {
  return (
    <StyledCommunity>
      <Container>
        <Heading>Join the community</Heading>
        <List>
          {items.map((item, itemIndex) => (
            <ListItem key={itemIndex}>
              <ListItemLink href={item.href} target="_blank">
                <ListItemVisual data-visual>
                  <ListItemVisualIcon src={item.icon} alt={item.title} />
                </ListItemVisual>
                <ListItemContent>
                  <ListItemTitle>{item.title}</ListItemTitle>
                  <ListItemParagraph>{item.description}</ListItemParagraph>
                </ListItemContent>
              </ListItemLink>
            </ListItem>
          ))}
        </List>
      </Container>
    </StyledCommunity>
  )
}

export default Community
