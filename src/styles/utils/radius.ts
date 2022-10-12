import type * as Stitches from '@stitches/react'

export default {
  br: (value: Stitches.PropertyValue<'borderRadius'>) => ({
    borderRadius: value,
  }),
  bbr: (value: Stitches.PropertyValue<'borderTopRightRadius'>) => ({
    borderBottomRightRadius: value,
    borderBottomLeftRadius: value,
  }),
  btr: (value: Stitches.PropertyValue<'borderTopRightRadius'>) => ({
    borderTopRightRadius: value,
    borderTopLeftRadius: value,
  }),
  blr: (value: Stitches.PropertyValue<'borderTopRightRadius'>) => ({
    borderTopLeftRadius: value,
    borderBottomLeftRadius: value,
  }),
  brr: (value: Stitches.PropertyValue<'borderTopRightRadius'>) => ({
    borderTopRightRadius: value,
    borderBottomRightRadius: value,
  }),
}
