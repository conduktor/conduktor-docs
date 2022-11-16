require('dotenv').config()

const analytics = [
  '@docusaurus/plugin-google-analytics',
  {
    trackingID: process.env.GOOGLE_UA_ID,
  },
]

exports.analytics = analytics
