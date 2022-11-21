import Hero from '@site/src/features/faq/organisms/Hero'
import List from '@site/src/features/faq/organisms/List'
import { items } from '@site/src/features/faq/organisms/List/List.constants'
import Layout from '@theme/Layout'
import React from 'react'
import Container from '../components/atoms/Container'
import useFluidContainer from '../hooks/useFluidContainer'

export default function Home(): JSX.Element {
  useFluidContainer()

  return (
    <Layout>
      <Hero />
      <Container>
        <List items={items} />
      </Container>
    </Layout>
  )
}
