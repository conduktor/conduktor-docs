import Layout from '@theme-original/Layout'
import React from 'react'
import { IntercomProvider } from 'react-use-intercom'

export default function LayoutWrapper(props) {
  return (
    <>
      <IntercomProvider appId={process.env.REACT_APP_INTERCOM_ID} autoBoot={true}>
        <Layout {...props} />
      </IntercomProvider>
    </>
  )
}
