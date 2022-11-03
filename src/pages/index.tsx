import Layout from '@theme/Layout'
import React from 'react'
import Hero from '../features/home/organisms/Hero'
import useFluidContainer from '../hooks/useFluidContainer'

export default function Home(): JSX.Element {
  useFluidContainer()

  return (
    <Layout>
      <Hero />
    </Layout>
  )
}
