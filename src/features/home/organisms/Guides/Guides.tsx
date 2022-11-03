import Container from '@site/src/components/atoms/Container'
import React from 'react'
import Heading from '../../atoms/Heading'
import { items } from './Guides.constants'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemLink,
  ListItemTitle,
  StyledGuides,
} from './Guides.styled'

interface GuidesProps {}

const Guides: React.FunctionComponent<GuidesProps> = () => {
  return (
    <StyledGuides>
      <Container>
        <Heading>Deployment guides</Heading>
        <List>
          {items.map((item, itemIndex) => (
            <ListItem key={itemIndex}>
              <ListItemLink href={item.href}>
                <ListItemIcon src={item.icon} alt={item.title} />
                <ListItemTitle>{item.title}</ListItemTitle>
              </ListItemLink>
            </ListItem>
          ))}
        </List>
      </Container>
    </StyledGuides>
  )
}

export default Guides
