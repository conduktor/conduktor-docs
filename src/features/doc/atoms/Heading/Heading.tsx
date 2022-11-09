import React from 'react'

interface HeadingProps {}

const Heading: React.FunctionComponent<HeadingProps> = () => {
  const [sticky, setSticky] = React.useState<boolean>(false)

  React.useEffect(() => {
    const scrollEvent = () => {
      setSticky(window.scrollY >= 100)
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

  return null
}

export default Heading
