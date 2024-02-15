import { globalCss } from '..'

const Roobert = (name: string, fontWeight: number, fontStyle = 'normal') => ({
  fontFamily: 'Roobert',
  fontDisplay: 'swap' as any,
  fontStyle,
  fontWeight,
  src: `url('/fonts/${name}.woff2?v=3.19') format('woff2'), url('/fonts/${name}.woff?v=3.19') format('woff')`,
})

// const Roobert = (name: string, fontWeight: number, fontStyle = 'normal') => ({
//   fontFamily: 'Roobert',
//   fontDisplay: 'swap' as any,
//   fontStyle,
//   fontWeight,
//   src: `url('/fonts/${name}.woff2') format('woff2'), url('/fonts/${name}.woff') format('woff')`,
// })

const GeistMono = (name: string, fontWeight: number, fontStyle = 'normal') => ({
  fontFamily: 'Geist Mono',
  fontDisplay: 'swap' as any,
  fontStyle,
  fontWeight,
  src: `url('/fonts/${name}.woff2') format('woff2')`,
})

export default globalCss({
  '@font-face': [
    Roobert('Roobert-Regular', 400),
    Roobert('Roobert-Medium', 500),
    Roobert('Roobert-SemiBold', 600),
    Roobert('Roobert-Bold', 700),
    Roobert('Roobert-ExtraBold', 800),
    Roobert('Roobert-Italic', 400, 'italic'),

    GeistMono('GeistMono-Regular', 400),
    GeistMono('GeistMono-Medium', 500),
    GeistMono('GeistMono-SemiBold', 600),
    GeistMono('GeistMono-Bold', 700),
  ],
})
