import Tree from '@theme-original/TOCItems/Tree'
import React from 'react'

export default function TreeWrapper(props) {
  return (
    <>
      <strong>Quick nav</strong>
      <Tree {...props} />
    </>
  )
}
