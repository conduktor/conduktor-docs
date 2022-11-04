import Container from '@site/src/components/atoms/Container'
import React from 'react'
import Heading from '../../atoms/Heading'
import Desktop from '../../molecules/Desktop'
import { items } from './Guides.constants'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemLink,
  ListItemTitle,
  ListItemTitleArrow,
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
                <ListItemTitle>
                  {item.title}
                  <ListItemTitleArrow src="/assets/svgs/common/arrowRight.svg" alt="Arrow right" />
                </ListItemTitle>
              </ListItemLink>
            </ListItem>
          ))}
        </List>
        <Desktop />
      </Container>
    </StyledGuides>
  )
}

export default Guides
