import useKeyCombination from '@site/src/hooks/useKeyCombination'
import React from 'react'
import { isMacOs } from 'react-device-detect'
import SearchModal from '../../organisms/SearchModal'
import {
  SearchInputIcon,
  SearchInputShortcut,
  SearchInputShortcutKey,
  SearchInputText,
  StyledSearchInput,
} from './SearchInput.styled'

interface SearchInputProps {
  compact?: boolean
}

const SearchInput: React.FunctionComponent<SearchInputProps> = ({ compact = false }) => {
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
      <StyledSearchInput compact={compact} onClick={() => setModal(true)}>
        <SearchInputIcon compact={compact} src="/assets/svgs/search.svg" alt="Search Icon" />
        <SearchInputText type="text" defaultValue="Search" readOnly={true} />
        <SearchInputShortcut compact={compact}>
          <SearchInputShortcutKey compact={compact}>
            {isMacOs ? '⌘' : 'CTRL'}
          </SearchInputShortcutKey>
          <SearchInputShortcutKey compact={compact}>K</SearchInputShortcutKey>
        </SearchInputShortcut>
      </StyledSearchInput>
      {modal && <SearchModal modal={modal} setModal={setModal} />}
    </React.Fragment>
  )
}

export default SearchInput
