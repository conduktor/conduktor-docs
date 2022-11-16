require('dotenv').config()

const gtm = [
  require.resolve('docusaurus-gtm-plugin'),
  {
    id: process.env.GOOGLE_GTM_ID,
  },
]

exports.gtm = gtm
