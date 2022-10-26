import Link from '@docusaurus/Link'
import { AlgoliaHitInterface } from '@site/src/@types'
import useKeyCombination from '@site/src/hooks/useKeyCombination'
import focusElement from '@site/src/utils/focusElement'
import highlightText from '@site/src/utils/highlightText'
import React from 'react'
import { Hit, HitDescription, HitTitle, StyledSearchHits } from './SearchHits.styled'

interface SearchHitsProps {
  hits: AlgoliaHitInterface[]
  query: string
  setModal: Function
}

const SearchHits: React.FunctionComponent<SearchHitsProps> = ({ hits, query, setModal }) => {
  const hitsRef = React.useRef<HTMLUListElement>(null)
  const [focus, setFocus] = React.useState<number>(-1)

  useKeyCombination({
    keys: ['ArrowDown'],
    callback: () => {
      const payload = focus + 1
      focusElement(hitsRef, `a[tabindex="${payload}"]`) && setFocus(payload)
    },
  })

  useKeyCombination({
    keys: ['ArrowUp'],
    callback: () => {
      const payload = focus - 1
      focusElement(hitsRef, `a[tabindex="${payload}"]`) && setFocus(payload)
    },
  })

  return (
    <StyledSearchHits ref={hitsRef}>
      {hits
        // .filter(hit => hit.title)
        .map((hit, hitIndex) => {
          const { title, description, slug } = hit
          return (
            <Hit key={hitIndex}>
              <Link to={slug} tabIndex={hitIndex} onClick={() => setModal(false)}>
                <HitTitle>{highlightText(title, query)}</HitTitle>
                <HitDescription>{highlightText(description, query)}</HitDescription>
              </Link>
            </Hit>
          )
        })}
    </StyledSearchHits>
  )
}

export default SearchHits
