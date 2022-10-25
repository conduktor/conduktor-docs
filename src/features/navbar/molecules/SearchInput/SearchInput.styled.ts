import { styled } from '@site/src/styles'

export const StyledSearchInput = styled('div', {
  backgroundColor: '$mauve3',
  borderRadius: '$radius3',
  padding: '$space4 $space4 $space4 $space10',
  fontSize: '$fontSize2',
  fontWeight: '$medium',
  position: 'relative',
  cursor: 'pointer',
  width: 300,
  color: '$mauve11',
  margin: '0 auto',
  boxShadow: '$shadow1',
})

export const SearchInputIcon = styled('img', {
  width: 18,
  height: 18,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: '$space5',
  pointerEvents: 'none',
})

export const SearchInputText = styled('input', {
  all: 'unset',
  pointerEvents: 'none',
})

export const SearchInputShortcut = styled('ul', {
  all: 'unset',
  listStyleType: 'none',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  right: '$space5',
  display: 'flex',
  gap: '$space2',
})

export const SearchInputShortcutKey = styled('li', {
  backgroundColor: '#fff',
  borderRadius: '$radius2',
  fontSize: '$fontSize1',
  fontWeight: '$bold',
  color: '$mauve10',
  lineHeight: '$fit',
  textTransform: 'uppercase',
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '$shadow1',
})
