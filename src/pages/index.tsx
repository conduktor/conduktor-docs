import Head from '@docusaurus/Head'
import Layout from '@theme/Layout'
import React, { Fragment } from 'react'
import Community from '../features/home/organisms/Community'
import GetStarted from '../features/home/organisms/GetStarted'
import BrowseBy from '../features/home/organisms/BrowseBy'
import Hero from '../features/home/organisms/Hero'
import Products from '../features/home/organisms/Products'
import useFluidContainer from '../hooks/useFluidContainer'
import BrowseByProducts from "@site/src/features/home/organisms/BrowseByProducts";

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
        <BrowseByProducts />
        <BrowseBy what="Use-Cases" />
        <Community />
      </Layout>
    </Fragment>
  )
}
