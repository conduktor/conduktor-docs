import { styled } from '@site/src/styles'

export const StyledContainer = styled('div', {
  variants: {
    breakpoint: {
      initial: {
        maxWidth: '75%',
      },
      bp3: {
        maxWidth: '100%',
      },
    },
  },
})
