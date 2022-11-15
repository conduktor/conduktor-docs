import React from 'react'
import { isMobile } from 'react-device-detect'
// @ts-ignore
import SpinnerDots from '@site/src/components/atoms/SpinnerDots'
import useScript from '@site/src/hooks/useScript'
import { default as ReactForm } from 'react-hubspot-form'
import {
  HubSpotFormLoader,
  stylesheet,
  stylesheetDesktop,
  stylesheetMobile,
} from './HubSpotForm.styled'

interface FormProps {
  formId: string
  height: number | string
  submitButtonWidth?: number | string
  customCSS?: string
  onSubmit?: Function
}

const Form: React.FunctionComponent<FormProps> = ({
  formId,
  height,
  submitButtonWidth = undefined,
  customCSS,
  onSubmit,
}) => {
  const isBrowser = typeof window !== 'undefined'
  onSubmit &&
    useScript({ path: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.slim.min.js' })

  return isBrowser ? (
    <ReactForm
      portalId="8861897"
      formId={formId}
      onSubmit={onSubmit}
      cssRequired={
        stylesheet({ submitButtonWidth, customCSS }) +
        (isMobile ? stylesheetMobile : stylesheetDesktop)
      }
      loading={
        <HubSpotFormLoader css={{ height }}>
          <SpinnerDots type="primary" size={8} />
        </HubSpotFormLoader>
      }
    />
  ) : null
}

export default Form
