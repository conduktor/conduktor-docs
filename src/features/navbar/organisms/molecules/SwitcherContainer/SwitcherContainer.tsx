import Flex from '@site/src/components/atoms/Flex'
import Badge from '@site/src/features/home/atoms/Badge'
import React from 'react'
import { items } from '../../../../home/organisms/Products/Products.constants'
import {
  List,
  ListItem,
  ListItemBadge,
  ListItemIcon,
  ListItemLink,
  ListItemParagraph,
  ListItemTitle,
  StyledSwitcherContainer,
} from './SwitcherContainer.styled'

interface SwitcherContainerProps {
  ref: React.RefObject<HTMLInputElement>
  handleClose: Function
  fade: 'in' | 'out'
}

const SwitcherContainer: React.FunctionComponent<SwitcherContainerProps> = ({
  ref,
  handleClose,
  fade,
}) => {
  React.useEffect(() => {
    return () => {
      handleClose()
    }
  }, [])

  return (
    <StyledSwitcherContainer ref={ref} fade={fade}>
      <List>
        {items.map((item, itemIndex) => (
          <ListItem key={itemIndex}>
            <ListItemLink to={item.to} onClick={() => handleClose()}>
              <ListItemIcon src={item.icon} alt={item.name} />
              <Flex direction="column">
                <ListItemTitle>{item.name}</ListItemTitle>
                <ListItemParagraph>{item.description}</ListItemParagraph>
              </Flex>
            </ListItemLink>
            {item.comingSoon ? (
              <ListItemBadge>
                <Badge>soon</Badge>
              </ListItemBadge>
            ) : (
              <span></span>
            )}
          </ListItem>
        ))}
      </List>
    </StyledSwitcherContainer>
  )
}

export default SwitcherContainer
