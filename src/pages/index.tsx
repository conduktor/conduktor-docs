import Layout from '@theme/Layout'
import React from 'react'
import GetStarted from '../features/home/organisms/GetStarted'
import Guides from '../features/home/organisms/Guides'
import Hero from '../features/home/organisms/Hero'
import Products from '../features/home/organisms/Products'
import useFluidContainer from '../hooks/useFluidContainer'

export default function Home(): JSX.Element {
  useFluidContainer()

  return (
    <Layout>
      <Hero />
      <Products />
      <GetStarted />
      <Guides />
    </Layout>
  )
}
