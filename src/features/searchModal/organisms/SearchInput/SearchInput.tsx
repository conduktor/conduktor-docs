import React from 'react'
import { SearchInputIcon, SearchInputText, StyledSearchInput } from './SearchInput.styled'

interface SearchInputProps {
  isHits: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

const SearchInput: React.FunctionComponent<SearchInputProps> = ({ isHits, onChange }) => {
  return (
    <StyledSearchInput isHits={isHits}>
      <SearchInputIcon src="/assets/svgs/search.svg" alt="Search Icon" />
      <SearchInputText type="text" placeholder="Search" autoFocus={true} onChange={onChange} />
    </StyledSearchInput>
  )
}

export default SearchInput
