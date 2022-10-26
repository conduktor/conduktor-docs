import algoliasearch from 'algoliasearch'

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APPLICATION_ID,
  process.env.REACT_APP_ALGOLIA_API_KEY
)
const algoliaSearchClient = searchClient.initIndex(process.env.REACT_APP_ALGOLIA_INDEX)

export default algoliaSearchClient
