import Flex from '@site/src/components/atoms/Flex'
import ChevronDownIcon from '@site/src/svgs/angleDown'
import React from 'react'
import {
  Item,
  ItemAnswer,
  ItemQuestion,
  ItemQuestionContainer,
  Items,
  StyledList,
} from './List.styled'

interface FAQProps {
  items: {
    question: string
    answer: string
  }[]
}

const FAQ: React.FunctionComponent<FAQProps> = ({ items }) => {
  const [activeItems, setActiveItems] = React.useState<number[]>([])

  return (
    <StyledList>
      <Items breakpoint={{ '@initial': 'initial', '@bp3': 'bp3' }}>
        {items.map((item, itemIndex) => {
          const isExpanded = activeItems.includes(itemIndex)
          return (
            <Item
              expanded={isExpanded}
              onClick={() => {
                if (isExpanded) setActiveItems(activeItems.filter(snap => snap !== itemIndex))
                else setActiveItems([...activeItems, itemIndex])
              }}
            >
              <ItemQuestionContainer>
                <Flex direction="row" align="center">
                  <ChevronDownIcon />
                  <ItemQuestion>{item.question}</ItemQuestion>
                </Flex>

                <ItemAnswer
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                  expanded={isExpanded}
                />
              </ItemQuestionContainer>
            </Item>
          )
        })}
      </Items>
    </StyledList>
  )
}

export default FAQ
