import React from 'react'
import {
  SearchInputIcon,
  SearchInputShortcut,
  SearchInputShortcutKey,
  SearchInputText,
  StyledSearchInput,
} from './SearchInput.styled'

interface SearchInputProps {}

const SearchInput: React.FunctionComponent<SearchInputProps> = () => {
  return (
    <StyledSearchInput>
      <SearchInputIcon src="/assets/svgs/search.svg" alt="Search Icon" />
      <SearchInputText type="text" value="Search" />
      <SearchInputShortcut>
        <SearchInputShortcutKey>⌘</SearchInputShortcutKey>
        <SearchInputShortcutKey>K</SearchInputShortcutKey>
      </SearchInputShortcut>
    </StyledSearchInput>
  )
}

export default SearchInput
