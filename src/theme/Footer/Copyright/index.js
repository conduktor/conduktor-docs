import Flex from '@site/src/components/atoms/Flex'
import SocialIcons from '@site/src/features/footer/molecules/SocialIcons'
import Copyright from '@theme-original/Footer/Copyright'
import React from 'react'

export default function CopyrightWrapper(props) {
  return (
    <>
      <Flex align="center" justify="space-between">
        <Copyright {...props} />
        <SocialIcons />
      </Flex>
    </>
  )
}
