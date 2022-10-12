import * as utils from './utils'

import { createStitches } from '@stitches/react'

import media from './media'
import theme from './theme'

export const { styled, css, createTheme, getCssText, globalCss, keyframes, reset, config } =
  createStitches({
    theme,
    media,
    utils,
  })
