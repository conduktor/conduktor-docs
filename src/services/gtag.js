require('dotenv').config()

const gtag = [
  '@docusaurus/plugin-google-gtag',
  {
    trackingID: process.env.GOOGLE_GTAG_ID,
  },
]

exports.gtag = gtag
