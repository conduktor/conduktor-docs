import { styled } from '@site/src/styles'

export const StyledList = styled('div', {
  marginBottom: '$space14',
})

export const Items = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
  display: 'block',
  margin: '0 auto',

  variants: {
    breakpoint: {
      initial: {
        width: '60%',
      },
      bp3: {
        width: '100%',
      },
    },
  },
})

export const Item = styled('li', {
  cursor: 'pointer',
  padding: '$space9',
  userSelect: 'none',
  borderRadius: '$radius6',
  backgroundColor: 'transparent',
  marginBottom: '$space6',
  transition: 'background-color 200ms ease-out',

  svg: {
    transition: 'transform 200ms ease',
  },

  variants: {
    expanded: {
      true: {
        backgroundColor: '$mauve2',

        svg: {
          transform: 'rotate(-180deg)',
        },
      },
    },
  },
})

export const ItemQuestionContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  svg: {
    marginRight: '$space6',
  },
})

export const ItemQuestion = styled('strong', {
  color: '$mauve12',
  fontWeight: '$semi',
  fontSize: '$fontSize4',
})

export const ItemAnswer = styled('p', {
  marginTop: '$space5',
  marginLeft: 'calc($space6 + 16px)',
  color: '$mauve11',

  variants: {
    expanded: {
      true: {
        display: 'block',
      },
      false: {
        display: 'none',
      },
    },
  },
})
