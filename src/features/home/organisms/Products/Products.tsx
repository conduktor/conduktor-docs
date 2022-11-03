import Container from '@site/src/components/atoms/Container'
import React from 'react'
import Heading from '../../atoms/Heading'
import { items } from './Products.constants'
import {
  List,
  ListItem,
  ListItemDescription,
  ListItemLink,
  ListItemName,
  ListVisual,
  ListVisualImage,
  StyledProducts,
} from './Products.styled'

interface ProductsProps {}

const Products: React.FunctionComponent<ProductsProps> = () => {
  return (
    <StyledProducts>
      <Container>
        <Heading>Browse by product</Heading>
        <List>
          {items.map((item, itemIndex) => (
            <ListItem key={itemIndex}>
              <ListItemLink to={item.to}>
                <ListVisual>
                  <ListVisualImage src={item.icon} alt={item.name} />
                </ListVisual>
                <ListItemName>{item.name}</ListItemName>
                <ListItemDescription>{item.description}</ListItemDescription>
              </ListItemLink>
            </ListItem>
          ))}
        </List>
      </Container>
    </StyledProducts>
  )
}

export default Products
