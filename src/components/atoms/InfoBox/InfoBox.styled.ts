import { styled } from '@site/src/styles'

export const StyledInfoBox = styled('div', {
  padding: '$space8',
  borderRadius: '$radius1',
  marginBottom: '$space6',

  variants: {
    type: {
      info: {
        backgroundColor: '$purple3',
        borderLeft: '4px solid $purple9',

        strong: {
          color: '$purple9',
        },
      },
      success: {
        backgroundColor: '$grass3',
        borderLeft: '4px solid $grass9',

        strong: {
          color: '$grass11',
        },
      },
      warning: {
        backgroundColor: '$amber3',
        borderLeft: '4px solid $amber9',

        strong: {
          color: '$amber11',
        },
      },
      danger: {
        backgroundColor: '$tomato3',
        borderLeft: '4px solid $tomato9',

        strong: {
          color: '$tomato11',
        },
      },
    },
  },
})

export const InfoBoxTitle = styled('strong', {
  fontWeight: '$bold',
  fontFamily: '$poly',
  display: 'block',
  marginBottom: '$space4',
})

export const InfoBoxContent = styled('div', {})
