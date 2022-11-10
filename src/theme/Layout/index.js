import Head from '@docusaurus/Head'
import Layout from '@theme-original/Layout'
import React from 'react'
import { IntercomProvider } from 'react-use-intercom'

export default function LayoutWrapper(props) {
  return (
    <>
      <Head>
        <script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/d1d822f8cf711550b6138a7b/script.js"
        ></script>
      </Head>
      <IntercomProvider appId={process.env.REACT_APP_INTERCOM_ID} autoBoot={true}>
        <Layout {...props} />
      </IntercomProvider>
    </>
  )
}
