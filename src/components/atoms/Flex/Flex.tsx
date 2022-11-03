import { styled } from '../../../styles'

const Flex = styled('div', {
  boxSizing: 'border-box',
  display: 'flex',

  variants: {
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    fullHeight: {
      true: {
        height: '100%',
      },
    },
    direction: {
      row: {
        flexDirection: 'row',
      },
      column: {
        flexDirection: 'column',
      },
      'row-reverse': {
        flexDirection: 'row-reverse',
      },
      'column-reverse': {
        flexDirection: 'column-reverse',
      },
    },
    align: {
      'flex-start': {
        alignItems: 'flex-start',
      },
      center: {
        alignItems: 'center',
      },
      'flex-end': {
        alignItems: 'flex-end',
      },
      stretch: {
        alignItems: 'stretch',
      },
      baseline: {
        alignItems: 'baseline',
      },
    },
    justify: {
      'flex-start': {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      'flex-end': {
        justifyContent: 'flex-end',
      },
      'space-between': {
        justifyContent: 'space-between',
      },
      'space-around': {
        justifyContent: 'space-around',
      },
    },
    wrap: {
      wrap: {
        flexWrap: 'wrap',
      },
      nowrap: {
        flexWrap: 'nowrap',
      },
      'wrap-reverse': {
        flexWrap: 'wrap-reverse',
      },
    },
    gap: {
      0: { gap: 0 },
      1: { gap: '$space1' },
      2: { gap: '$space2' },
      3: { gap: '$space3' },
      4: { gap: '$space4' },
      5: { gap: '$space5' },
      6: { gap: '$space6' },
      7: { gap: '$space7' },
      8: { gap: '$space8' },
      9: { gap: '$space9' },
      10: { gap: '$space10' },
      11: { gap: '$space11' },
      12: { gap: '$space12' },
      13: { gap: '$space13' },
      14: { gap: '$space14' },
    },
  },
})

export default Flex
