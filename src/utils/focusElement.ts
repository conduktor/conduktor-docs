const focusElement = (
  ref: React.MutableRefObject<HTMLElement | HTMLUListElement>,
  query: string
) => {
  const element = ref.current.querySelector(query) as HTMLElement
  if (element) {
    element.focus()
    return true
  }
}

export default focusElement
