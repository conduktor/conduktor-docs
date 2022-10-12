import type * as Stitches from '@stitches/react'

export default {
  bg: (value: Stitches.PropertyValue<'backgroundColor'>) => ({
    backgroundColor: value,
  }),
  size: (value: Stitches.PropertyValue<'width'>) => ({
    width: value,
    height: value,
  }),
}
