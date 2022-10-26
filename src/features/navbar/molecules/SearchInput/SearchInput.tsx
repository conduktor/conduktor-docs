import useKeyCombination from '@site/src/hooks/useKeyCombination'
import React from 'react'
import { isMacOs } from 'react-device-detect'
import SearchModal from '../../../../components/organisms/SearchModal'
import {
  SearchInputIcon,
  SearchInputShortcut,
  SearchInputShortcutKey,
  SearchInputText,
  StyledSearchInput,
} from './SearchInput.styled'

interface SearchInputProps {}

const SearchInput: React.FunctionComponent<SearchInputProps> = () => {
  const [modal, setModal] = React.useState<boolean>(false)

  useKeyCombination({
    keys: ['KeyK'],
    metaKey: true,
    callback: () => {
      setModal(true)
    },
  })

  return (
    <React.Fragment>
      <StyledSearchInput onClick={() => setModal(true)}>
        <SearchInputIcon src="/assets/svgs/search.svg" alt="Search Icon" />
        <SearchInputText type="text" defaultValue="Search" readOnly={true} />
        <SearchInputShortcut>
          <SearchInputShortcutKey>{isMacOs ? '⌘' : 'CTRL'}</SearchInputShortcutKey>
          <SearchInputShortcutKey>K</SearchInputShortcutKey>
        </SearchInputShortcut>
      </StyledSearchInput>
      {modal && <SearchModal modal={modal} setModal={setModal} />}
    </React.Fragment>
  )
}

export default SearchInput
