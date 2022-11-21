import algoliasearch from 'algoliasearch'
import dotenv from 'dotenv'
import fs from 'fs'
import { globby } from 'globby'
import matter from 'gray-matter'

dotenv.config()

const client = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_KEY
)

;(async () => {
  const pages = await globby(['docs/platform'], {
    expandDirectories: {
      extensions: ['md', 'mdx'],
    },
  })

  const objects = pages.map(page => {
    const fileContents = fs.readFileSync(page, 'utf8')
    const { data, content } = matter(fileContents)
    const slug = page
      .replace('.md', '')
      .replace('.mdx', '')
      .replace('docs', '')
      .replace('/index', '')

    if (!data.title) throw new Error(`Title is missing for ${slug}`)
    if (!data.description) throw new Error(`Description is missing for ${slug}`)

    return {
      title: data.title,
      description: data.description,
      slug,
      content,
    }
  })

  const index = client.initIndex(process.env.REACT_APP_ALGOLIA_INDEX)
  objects &&
    index.clearObjects() &&
    index.saveObjects(objects, {
      autoGenerateObjectIDIfNotExist: true,
    }) &&
    console.log('\x1b[32m[SUCCESS]\x1b[0m Algolia \x1b[32msuccessfuly\x1b[0m indexed')
})()
