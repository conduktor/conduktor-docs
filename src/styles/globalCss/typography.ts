import { globalCss } from '..'

// TODO: remove important after bulma is completely removed
export default globalCss({
  'html, body': {
    fontFamily: '$sans',
    fontSize: 16,
    fontWeight: '$regular',
    color: '$mauve11',
  },

  'h1, h2, h3, h4, h5, h6, strong': {
    fontFamily: '$poly !important',
    fontWeight: '$medium !important',
  },
})
