import fs from 'fs'
import { getCssText } from './src/styles'

fs.writeFile('./src/css/stitches.css', getCssText(), error => {
  if (error) console.error(error)

  console.info('CSS file generated')
})
