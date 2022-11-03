import React from 'react'

const useFluidContainer = () => {
  React.useEffect(() => {
    const containerElement = document.querySelector('.main-wrapper') as HTMLElement
    if (containerElement) containerElement.style.maxWidth = '100%'

    return () => {
      if (containerElement) containerElement.style.maxWidth = 'var(--ifm-container-width)'
    }
  }, [])
}

export default useFluidContainer
