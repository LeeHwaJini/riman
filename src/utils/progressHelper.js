/**
 * progress
 */

import { Loading, QSpinner } from 'quasar'
import LoadingSpinner from '@components/LoadingSpinner'

const progressHelper = {
  /**
   * progress show
   */
  show() {
    Loading.show({
      spinner: LoadingSpinner
    })
  },
  /**
   * progress hide
   */
  hide() {
    Loading.hide()
  }
}

export default progressHelper
