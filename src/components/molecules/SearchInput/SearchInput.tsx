import useKeyCombination from '@site/src/hooks/useKeyCombination'
import React from 'react'
import { isMacOs } from 'react-device-detect'
import SearchModal from '../../organisms/SearchModal'
import styles from './SearchInput.module.scss'

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
      <div
        className={styles.StyledSearchInput}
        data-compact={compact}
        onClick={() => setModal(true)}
      >
        <img
          className={styles.SearchInputIcon}
          data-compact={compact}
          src="/assets/svgs/search.svg"
          alt="Search Icon"
        />
        <input
          className={styles.SearchInputText}
          type="text"
          defaultValue="Search"
          readOnly={true}
        />
        <ul className={styles.SearchInputShortcut} data-compact={compact}>
          <li className={styles.SearchInputShortcutKey} data-compact={compact}>
            {isMacOs ? '⌘' : 'CTRL'}
          </li>
          <li className={styles.SearchInputShortcutKey} data-compact={compact}>
            K
          </li>
        </ul>
      </div>
      {modal && <SearchModal modal={modal} setModal={setModal} />}
    </React.Fragment>
  )
}

export default SearchInput
