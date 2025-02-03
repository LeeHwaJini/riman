import http from '@/utils/http'
import { i18n } from '@utils/i18n'

export default class UploadAdapter {
  constructor(loader, type) {
    this.loader = loader
    this.type = type
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          if (file.size > 31457280) {
            alert(i18n.global.t('UTI_FileSizeError'))
            reject()
            return
          }
          this.initRequest(file, resolve, reject)
        })
    )
  }

  async initRequest(file, resolve, reject) {
    const data = new FormData()
    console.log('file===', file)
    console.log('contentType', file.type)
    console.log('type===', 'PRODUCT')
    data.append('file', file)
    data.append('contentType', file.type)
    data.append('type', 'PRODUCT')
    // process.env.VUE_APP_S3_URL
    try {
      const result = await http().url('/product/v1/media-storage/upload').param(data).post()
      console.log('${process.env.VUE_APP_ETC_S3_URL}', `${process.env.VUE_APP_S3_URL}`)
      console.log('result===', result)
      resolve({
        default: `${process.env.VUE_APP_S3_URL}${result.data}`,
        '1024': `${process.env.VUE_APP_S3_URL}${result.data}`
      })
    } catch (e) {
      alert(i18n.global.t('UTI_FileUploadError'))
      reject()
    }
  }
}
