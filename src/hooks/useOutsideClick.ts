import React from 'react'

interface useOutsideClickProps {
  parentRef: React.MutableRefObject<HTMLInputElement>
  callback: Function
}

const useOutsideClick = ({ parentRef, callback }: useOutsideClickProps) => {
  React.useEffect(() => {
    const listener = (event: MouseEvent) => {
      const parentElement = parentRef.current as HTMLElement
      const target = event.target as HTMLElement

      if (target && (!parentElement.contains(target) || !parentElement)) callback()
    }

    document.addEventListener(
      'mousedown',
      listener as unknown as EventListenerOrEventListenerObject
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        listener as unknown as EventListenerOrEventListenerObject
      )
    }
  }, [callback])
}

export default useOutsideClick
