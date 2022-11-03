const isBrowser = typeof window !== 'undefined'

isBrowser &&
  document.addEventListener('DOMContentLoaded', event => {
    const bodyElement = document.querySelector('body')
    if (bodyElement) bodyElement.style.opacity = 1
  })
