import React, { Dispatch, SetStateAction } from 'react'
import ReactDOM from 'react-dom'

import { ANIMATION_DURATION, SEARCH_MIN_LENGTH } from './SearchModal.constants'
import { ContentContainer, StyledSearchModal } from './SearchModal.styled'

import { AlgoliaHitInterface } from '@site/src/@types'
import SearchHits from '@site/src/features/searchModal/organisms/SearchHits'
import SearchInput from '@site/src/features/searchModal/organisms/SearchInput'
import useKeyCombination from '@site/src/hooks/useKeyCombination'
import useOutsideClick from '@site/src/hooks/useOutsideClick'
import algoliaSearchClient from '@site/src/services/algolia'

interface SearchModalProps {
  modal: boolean
  setModal: Dispatch<SetStateAction<boolean>>
}

const SearchModal: React.FunctionComponent<SearchModalProps> = ({ setModal }) => {
  const contentContainerRef = React.useRef<HTMLInputElement>(null)
  const [fade, setFade] = React.useState<'in' | 'out'>('in')
  const [query, setQuery] = React.useState<string>('')
  const [hits, setHits] = React.useState<AlgoliaHitInterface[]>([])
  const domNode = document.getElementById('__docusaurus')

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value

    if (!query || query.length < SEARCH_MIN_LENGTH) {
      setHits([])
      return
    }

    setQuery(query)

    const result = await algoliaSearchClient.search(query)
    const hits = result.hits as AlgoliaHitInterface[]

    setHits(hits ? hits : [])
  }

  const handleClose = () => {
    setFade('out')
    setTimeout(() => setModal(false), ANIMATION_DURATION)
  }

  useKeyCombination({
    keys: ['Escape'],
    callback: handleClose,
  })

  useOutsideClick({
    parentRef: contentContainerRef,
    callback: handleClose,
  })

  React.useEffect(() => {
    document.body.style.overflowY = 'hidden'

    return () => {
      document.body.style.overflowY = ''
    }
  }, [])

  const isHits = hits.length > 0 ? true : false

  return ReactDOM.createPortal(
    <StyledSearchModal fade={fade}>
      <ContentContainer ref={contentContainerRef}>
        <SearchInput onChange={handleSearch} isHits={isHits} />
        {isHits && <SearchHits hits={hits} query={query} setModal={setModal} />}
      </ContentContainer>
    </StyledSearchModal>,
    domNode
  )
}

export default SearchModal
