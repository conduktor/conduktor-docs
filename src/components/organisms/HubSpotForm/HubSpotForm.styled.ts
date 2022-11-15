import { styled } from '@site/src/styles'
import { fadeIn } from '@site/src/styles/keyframes'

export const HubSpotFormLoader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  opacity: 0,
  animation: `${fadeIn} 250ms 0ms both`,
})

interface stylesheetProps {
  submitButtonWidth?: string | number
  customCSS?: string
}

export const stylesheet = ({ submitButtonWidth = undefined, customCSS = '' }: stylesheetProps) => {
  return `${customCSS}
  
  form {
    width: auto !important;
    animation-name: fadeIn;
    animation-duration: 200ms;
  }

  fieldset {
    border: none;
  }

  label:not(.hs-error-msg) {
    text-transform: uppercase;
    color: #666 !important;
    font-weight: 500;
    font-size: 0.75rem !important;
  }

  label.hs-error-msg {
    font-size: 0.75rem !important;
    color: #e54d2e !important;
    margin-top: 4px;
    animation-name: fadeIn;
    animation-duration: 200ms;
  }

  .hs-error-msgs {
    margin: 0 !important;
    padding-left: 0px !important;
  }

  .form-columns-1 {
    padding: 0;
  }

  select:not(.hs-fieldtype-intl-phone),
  input.hs-input {
    padding: 0px 12px !important;
    font-size: 0.875rem !important;
    color: rgb(52, 64, 85);
    border-radius: 5px !important;
    background-color: #fff !important;
    width: 100%;
    border: 1px solid #eaeaea;
    border-color: #eaeaea !important;
    outline: none;
    transition: border-color 150ms ease;
  }

  .input {
    position: relative;
  }

  textarea {
    width: 100% !important;
    max-width: unset !important;
    padding: 12px !important;
    font-size: 0.875rem !important;
    color: rgb(52, 64, 85);
    border-radius: 5px !important;
    background-color: #fff !important;
    border: 1px solid #eaeaea;
    border-color: #eaeaea !important;
    outline: none;
    transition: border-color 150ms ease;
    resize: none;
  }

  .hs-input {
    max-width: unset !important;
  }

  .hs-input:focus {
    border-color: hsl(243, 92%, 95%) !important;
  }

  .hs-fieldtype-intl-phone {
    padding: 0px !important;
    border: none;
    display: flex;
    width: 100% !important;
  }

  .hs-fieldtype-intl-phone select {
    width: 75px;
    background-color: #fff !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-color: #eaeaea;
  }

  .hs-fieldtype-intl-phone input {
    width: calc(100% - 75px);
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-left: none;
  }

  .legal-consent-container ul {
    padding: 0 !important;
    margin: 0 !important;
  }

  .legal-consent-container ul li label {
    display: flex;
    text-transform: initial !important;
    cursor: pointer;
    user-select: none;
    color: rgb(52, 64, 85) !important;
    font-size: .75rem !important;
  }

  .legal-consent-container ul li label p {
    margin: 0 !important;
  }

  .legal-consent-container .hs-richtext p {
    font-size: 0.75rem;
    color: rgb(52, 64, 85) !important;
    margin-top: 0 !important;
  }

  .hs_submit .actions {
    margin: 0;
    padding: 0;
  }

  .hs_submit .actions input {
    height: 40px;
    background-color: hsl(244, 78%, 58%);
    border-radius: 8px;
    font-size: 16px !important;
    font-weight: 700;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif !important;
    padding: 0 2rem;
    border: none;
    margin-top: 1rem;
    text-align: center;
    ${submitButtonWidth !== undefined && `width: ${submitButtonWidth};`}
  }

  .hs_submit .actions input:focus,
  .hs_submit .actions input:hover {
    background-color: hsl(244, 59%, 51%) !important;
    border-radius: 8px !important;
    font-size: 1rem !important;
    font-weight: 700 !important;
    padding: 0 2rem !important;
    border: none !important;
  }

  .hs_recaptcha,
  .hs-recaptcha {
    display: none;
  }

  .field:not(.hs_recaptcha) {
    display: grid;
  }

  .submitted-message p {
    color: hsl(252, 4.0%, 44.8%);
    font-size: 14px;
    margin: 0;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`
}

export const stylesheetMobile = `
  .form-columns-2 {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0;
    column-gap: 1rem;
  }
`
export const stylesheetDesktop = `
  .form-columns-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0;
    column-gap: 1rem;
  }
`
