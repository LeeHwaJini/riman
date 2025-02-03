/**
 * name: selectOptions.js
 * description: 공통 사용될 Select Options 정의
 */
import { i18n } from '@utils/i18n'
import { computed } from 'vue'

// 다국어 정보
export const langOptions = computed(() => [
  { label: 'KOREA', value: 'ko-KR' },
  { label: 'US/Canada/Hongkong', value: 'en-US' },
  { label: 'Taiwan', value: 'zh-TW' }
])
