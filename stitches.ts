import fs from 'fs'
import { getCssText } from './src/styles'

fs.writeFile('./static/css/stitches.css', getCssText(), error => {
  if (error) console.error(error)

  console.log('\x1b[36m[INFO]\x1b[0m CSS file generated')
})
