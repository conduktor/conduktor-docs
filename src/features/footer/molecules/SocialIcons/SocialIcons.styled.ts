import { styled } from '@site/src/styles'

export const StyledSocialIcons = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '$space6',
})

export const SocialItem = styled('a', {
  'svg path': {
    transition: 'fill 200ms ease',
  },
  '&:hover': {
    'svg[data-type="twitter"] path': {
      fill: '#1da1f2',
    },
    'svg[data-type="linkedin"] path': {
      fill: '#0a66c2',
    },
    'svg[data-type="github"] path': {
      fill: '$mauveDark11',
    },
    'svg[data-type="youtube"] path': {
      fill: '#ff0302',
    },
    'svg[data-type="angellist"] path': {
      fill: '$mauveDark11',
    },
  },
})
