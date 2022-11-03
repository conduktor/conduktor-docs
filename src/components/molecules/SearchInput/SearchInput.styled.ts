import { styled } from '@site/src/styles'

export const StyledSearchInput = styled('div', {
  position: 'relative',
  cursor: 'pointer',

  variants: {
    compact: {
      true: {
        backgroundColor: '$mauve3',
        borderRadius: '$radius3',
        padding: '$space4 $space4 $space4 $space10',
        fontSize: '$fontSize2',
        fontWeight: '$medium',
        width: 300,
        color: '$mauve11',
        margin: '0 auto',
        boxShadow: '$shadow1',
      },
      false: {
        backgroundColor: '#fff',
        borderRadius: '$radius7',
        border: '1px solid rgba(0, 0, 0, 0.07)',
        padding: '$space7 $space7 $space7 $space12',
        width: 600,
        margin: '0 auto',
        transition: 'box-shadow 200ms ease-in-out',

        '&:hover': {
          boxShadow:
            '0px 65px 26px rgba(76, 64, 231, 0.01), 0px 36px 22px rgba(76, 64, 231, 0.05), 0px 16px 16px rgba(76, 64, 231, 0.09), 0px 4px 9px rgba(76, 64, 231, 0.1), 0px 0px 0px rgba(76, 64, 231, 0.1)',
        },
      },
    },
  },
})

export const SearchInputIcon = styled('img', {
  width: 18,
  height: 18,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',

  variants: {
    compact: {
      true: {
        left: '$space5',
      },
      false: {
        left: '$space9',
      },
    },
  },
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
  display: 'flex',
  gap: '$space2',

  variants: {
    compact: {
      true: {
        right: '$space5',
      },
      false: {
        right: '$space9',
      },
    },
  },
})

export const SearchInputShortcutKey = styled('li', {
  borderRadius: '$radius1',
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

  variants: {
    compact: {
      true: {
        backgroundColor: '#fff',
      },
      false: {
        backgroundColor: '$mauve2',
      },
    },
  },
})
