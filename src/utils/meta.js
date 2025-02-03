/**
 * name: meta.js
 * description: Default Meta
 * https://quasar.dev/quasar-plugins/meta
 * create by chjm
 */
import { useMeta } from 'quasar'
import { i18n } from '@utils/i18n'

export function metaInfo(_metaData = defualtMeta(), _title = defualtTitle()) {
  useMeta({
    title: _title,
    meta: _metaData
  })
}

export function ogMetaInfo(_metaData = defualtMeta(), _title = defualtTitle()) {
  useMeta({
    title: _title,
    meta: [...defualtMeta(), ..._metaData]
  })
}

export function defualtTitle() {
  return i18n.global.t('MT_Title')
}

export function defualtMeta() {
  return [
    { name: 'description', content: i18n.global.t('MT_Description') },
    { name: 'keywords', content: i18n.global.t('MT_Keywords') },
    { name: 'name', content: 'RIMAN MALL' }
  ]
}
