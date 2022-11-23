import { useLocation } from '@docusaurus/router'
import useIsBrowser from '@docusaurus/useIsBrowser'
import SearchInput from '@site/src/components/molecules/SearchInput'
import Content from '@theme-original/DocSidebar/Desktop/Content'
import React from 'react'
import { SearchInputContainer } from './Content.styled'

export default function ContentWrapper(props) {
  const isBrowser = useIsBrowser()
  const location = useLocation()

  return (
    <>
      {isBrowser && !location.pathname.includes('/desktop') && (
        <SearchInputContainer>
          <SearchInput compact={true} />
        </SearchInputContainer>
      )}
      <div id="navbar-content-wrapper">
        <Content {...props} />
      </div>
    </>
  )
}
