import { globalCss } from '..'

const Inter = (name: string, fontWeight: number, fontStyle = 'normal') => ({
  fontFamily: 'Inter',
  fontDisplay: 'swap' as any,
  fontStyle,
  fontWeight,
  src: `url('/fonts/${name}.woff2?v=3.19') format('woff2'), url('/fonts/${name}.woff?v=3.19') format('woff')`,
})

const PolySans = (name: string, fontWeight: number, fontStyle = 'normal') => ({
  fontFamily: 'PolySans',
  fontDisplay: 'swap' as any,
  fontStyle,
  fontWeight,
  src: `url('/fonts/${name}.woff2') format('woff2'), url('/fonts/${name}.woff') format('woff')`,
})

const JetBrains = (name: string, fontWeight: number, fontStyle = 'normal') => ({
  fontFamily: 'JetBrains Mono',
  fontDisplay: 'swap' as any,
  fontStyle,
  fontWeight,
  src: `url('/fonts/${name}.woff2') format('woff2')`,
})

export default globalCss({
  '@font-face': [
    Inter('Inter-Regular', 400),
    Inter('Inter-Medium', 500),
    Inter('Inter-SemiBold', 600),
    Inter('Inter-Bold', 700),
    Inter('Inter-ExtraBold', 800),
    Inter('Inter-Italic', 400, 'italic'),

    PolySans('PolySans-Slim', 300),
    PolySans('PolySans-Neutral', 400),
    PolySans('PolySans-Median', 500),
    PolySans('PolySans-Median', 600),
    PolySans('PolySans-Median', 700),
    PolySans('PolySans-Median', 800),

    JetBrains('JetBrainsMono-Regular', 400),
    JetBrains('JetBrainsMono-Medium', 500),
    JetBrains('JetBrainsMono-SemiBold', 600),
    JetBrains('JetBrainsMono-Bold', 700),
  ],
})
