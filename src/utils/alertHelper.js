/**
 * alert 팝업창
 * create by CHJM (2022-02-25)
 */

import AlertComp from '@components/AlertComp'
import { Dialog } from 'quasar'

const alertHelper = {
  show(
    type,
    messageKey,
    {
      title = type === 'error' ? 'CM_Error' : '',
      ok = null,
      okLabel = 'CM_Ok',
      cancel = null,
      cancelLabel = 'CM_Cancel',
      okClassName = null,
      cancelClassName = null,
      wrapClassName = null,
      iconClassName = 'notifications'
    } = {}
  ) {
    return Dialog.create({
      component: AlertComp,
      componentProps: {
        type: type,
        title: title,
        message: messageKey,
        okLabel: okLabel,
        cancelLabel: cancelLabel,
        okClassName: okClassName,
        cancelClassName: cancelClassName,
        wrapClassName: wrapClassName,
        iconClassName: iconClassName
      }
    })
      .onOk(() => {
        if (ok) {
          ok()
        }
      })
      .onCancel(() => {
        if (cancel) {
          cancel()
        }
      })
  }
}

export default alertHelper
