import { styled } from '@site/src/styles'

export const DocsRating = styled('div', {
  display: 'inline-block',
  padding: '16px 30px 16px 40px',
  minHeight: '66px',
  marginTop: '42px',
  marginLeft: '-32px',
  backgroundColor: 'rgba(100, 215, 255, 0.3)',
  textAlign: 'center',
  color: '#057594',
  lineHeight: '32px',
  fontWeight: 500,
  borderRadius: '0 5px 5px 0',

  svg: {
    height: '1.5em',
    width: '1.5em',

    '&:hover, &:focus': {
      cursor: 'pointer',
      fill: 'blue',
    },
  },

  '.i_thumbsup': {
    fill: '#56a211',
    transform: 'translateY(0.25em)',
  },

  '.i_thumbsdown': {
    fill: '#e9430f',
    transform: 'scale(-1, -1) translateY(-0.25em)',
  },

  variants: {
    tiny: {
        true: {
            padding: 0,
            backgroundColor: 'transparent',
            margin: 0,
            marginTop: 20,

            svg: {
                height: '1em',
                width: '1em',
                marginLeft: 5,
                marginRight: 5,
            },
            '.voters': {
                display: 'inline-block',
                gap: '0.5em',
            },
        }
    }
  }
})
