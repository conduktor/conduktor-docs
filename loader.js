import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

if (ExecutionEnvironment.canUseDOM) {
  const headElement = document.getElementsByTagName('head')[0]
  const bodyElement = document.getElementsByTagName('body')[0]

  let link = document.createElement('link')
  link.href = '/css/stitches.css'
  link.type = 'text/css'
  link.rel = 'stylesheet'

  if (headElement) headElement.appendChild(link)
  if (bodyElement) bodyElement.style.opacity = 1
}
