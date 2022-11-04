import Heading from '@site/src/features/doc/atoms/Heading'
import Content from '@theme-original/DocItem/Content'
import React from 'react'

export default function ContentWrapper(props) {
  return (
    <>
      <Heading />
      <Content {...props} />
    </>
  )
}
