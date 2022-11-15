import { useEffect } from 'react'

interface useScriptType {
  path?: string
  content?: string
  type?: string
  id?: string
}

const useScript = ({ path, content, type, id }: useScriptType) => {
  useEffect(() => {
    const script = document.createElement('script')
    if (path) script.src = path
    if (content) script.textContent = content
    script.async = true
    if (type) script.type = type
    if (id) script.id = id
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [path])
}

export default useScript
