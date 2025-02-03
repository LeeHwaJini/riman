
import '@quasar/extras/material-icons/material-icons.css'
import lang from 'quasar/lang/ko-KR'
import langUS from 'quasar/lang/en-US'
import { getLocale } from '@utils/i18n'

import {
  Dialog,
  Loading,
  Notify,
  Meta
} from 'quasar'

export default {
  config: {
    Loading
  },
  components: {},
  plugins: {
    Dialog,
    Loading,
    Notify,
    Meta
  },
  lang: getLocale() === 'ko-KR' ? lang : langUS
}
