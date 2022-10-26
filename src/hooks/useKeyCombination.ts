import React, { KeyboardEvent } from 'react'

interface useKeyCombinationProps {
  keys: string[]
  metaKey?: boolean
  callback: Function
}

const useKeyCombination = ({ keys, metaKey, callback }: useKeyCombinationProps) => {
  React.useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const condition = metaKey
        ? (event.metaKey || event.ctrlKey) && keys.includes(event.code)
        : keys.includes(event.code)
      if (condition) {
        callback()
        event.preventDefault()
      }
    }

    document.addEventListener('keydown', listener as unknown as EventListenerOrEventListenerObject)

    return () => {
      document.removeEventListener(
        'keydown',
        listener as unknown as EventListenerOrEventListenerObject
      )
    }
  }, [callback])
}

export default useKeyCombination
