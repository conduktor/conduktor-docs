import Head from '@docusaurus/Head'
import Layout from '@theme-original/Layout'
import React from 'react'
import { IntercomProvider } from 'react-use-intercom'

export default function LayoutWrapper(props) {
  return (
    <>
      <Head>
        <meta property="og:image" content="/assets/images/og.png" />
      </Head>
      <IntercomProvider appId={process.env.REACT_APP_INTERCOM_ID} autoBoot={true}>
        <Layout {...props} />
      </IntercomProvider>
    </>
  )
}
