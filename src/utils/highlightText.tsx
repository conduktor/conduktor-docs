import React from 'react'

const highlightText = (text: string, highlight: string) => {
  const parts = text?.split(new RegExp(`(${highlight.replace(/[^a-zA-Z0-9 ]/g, '')})`, 'gi'))
  return parts?.map(part => (part.toLowerCase() === highlight.toLowerCase() ? <i>{part}</i> : part))
}

export default highlightText
