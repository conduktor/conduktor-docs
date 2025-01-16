import Head from '@docusaurus/Head'
import Layout from '@theme/Layout'
import React, { Fragment } from 'react'
import { JSX } from 'react'
import Community from '../features/home/organisms/Community'
import GetStarted from '../features/home/organisms/GetStarted'
import Guides from '../features/home/organisms/Guides'
import Hero from '../features/home/organisms/Hero'
import Products from '../features/home/organisms/Products'
import useFluidContainer from '../hooks/useFluidContainer'

const META_DESCRIPTION =
  'Find Documentation and FAQs for all Conduktor products, along with a weekly changelog and our Platform roadmap.'

export default function Home(): JSX.Element {
  useFluidContainer()

  return (
    <Fragment>
      <Head>
        <title>Conduktor Documentation</title>
        <meta property="og:title" content="Conduktor Documentation" />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
        <meta name="description" content={META_DESCRIPTION} />
      </Head>

      <Layout>
        <Hero />
        <Products />
        <GetStarted />
        <Guides />
        <Community />
      </Layout>
    </Fragment>
  )
}
