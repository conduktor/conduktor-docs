import React from 'react'

interface HeadingProps {}

const STICKY_OFFSET = 100
const Heading: React.FunctionComponent<HeadingProps> = () => {
  const [sticky, setSticky] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (window.scrollY >= STICKY_OFFSET) setSticky(true)

    const scrollEvent = () => {
      setSticky(window.scrollY >= STICKY_OFFSET ? true : false)
    }
    document.addEventListener('scroll', scrollEvent)

    return () => {
      document.removeEventListener('scroll', scrollEvent)
    }
  }, [])

  React.useEffect(() => {
    const headingElement = document.querySelector('main .markdown h1')
    if (headingElement) headingElement.setAttribute('data-sticky', sticky.toString())
  }, [sticky])

  React.useEffect(() => {
    const headingElement = document.querySelector('main .markdown h1')
    if (headingElement) {
      if (window.scrollY >= STICKY_OFFSET) headingElement.setAttribute('data-transition', 'false')

      setTimeout(() => {
        headingElement.setAttribute('data-transition', 'true')
      }, 200)
    }
  }, [])

  return null
}

export default Heading
