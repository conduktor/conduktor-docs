import { styled } from '@site/src/styles'

export const DocsRating = styled('div', {
  display: 'block',
  padding: '16px 30px 16px 40px',
  minHeight: '66px',
  marginTop: '42px',
  width: '100%',
  border: '1px solid var(--ifm-color-emphasis-300)',
  background: 'transparent',
  textAlign: 'left',
  color: '#057594',
  lineHeight: '32px',
  fontWeight: 500,
  borderRadius: '5px',

  span: {
    color: '#888',
    fontWeight: 'normal',
  },

  svg: {
    height: '1.5em',
    width: '1.5em',

    '&:hover, &:focus': {
      cursor: 'pointer',
      fill: 'blue',
    },
  },

  '.i_thumbsup': {
    fill: '#888',
    transform: 'translateY(0.25em)',
  },

  '.i_thumbsdown': {
    fill: '#888',
    transform: 'scale(-1, -1) translateY(-0.25em)',
  },

  variants: {
    tiny: {
        true: {
            padding: 0,
            backgroundColor: 'transparent',
            margin: 0,
            marginTop: 20,
            border: 'none',

            span: {
              fontSize: '0.9em',
            },

            svg: {
                height: '1em',
                width: '1em',
                marginLeft: 5,
                marginRight: 0,
            },
            '.voters': {
                display: 'inline-block',
                gap: '0.5em',
            },
        }
    }
  }
})
