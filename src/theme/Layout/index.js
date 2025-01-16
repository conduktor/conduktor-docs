import Head from '@docusaurus/Head'
import Layout from '@theme-original/Layout'
import React from 'react'

export default function LayoutWrapper(props) {
  return (
    <>
      <Head>
        <meta property="og:image" content="/assets/images/og.png" />
      </Head>
      <Layout {...props} />
    </>
  )
}
