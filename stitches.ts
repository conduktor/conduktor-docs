import fs from 'fs'
import { getCssText } from './src/styles'

fs.writeFile('./static/css/stitches.css', getCssText(), error => {
  if (error) console.error(error)

  console.log('\x1b[32m[SUCCESS]\x1b[0m CSS file generated \x1b[32msuccessfuly')
})
