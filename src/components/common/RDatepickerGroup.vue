<!--
기간 설정 달력
create by jhchoi (2024-03-29)
-->
<template>
  <div ref="_RDatepickerGroup" class="w-full">
    <div class="datepicker__wrap">
      <RDatepicker
        v-model="startDate"
        :options="optionStartDate"
        :navigation-max-year-month="type === 'month' ? navigationEndDateMonth() : undefined"
        :type="type"
        :disable="disable"
        :is-set-default="false"
      />

      <RDatepicker
        v-model="endDate"
        :options="optionEndDate"
        :navigation-min-year-month="type === 'month' ? navigationStartDateMonth() : undefined"
        :type="type"
        :disable="disable"
        :is-set-default="false"
      />
    </div>

    <RRadio v-if="showPeriod" v-model="period" :options="PERIODS" class="option-group-area" @update:model-value="onChangePeriod" />

  </div>
</template>

<script setup>
import { defineProps, defineModel, computed, watch, onMounted, getCurrentInstance, defineExpose } from 'vue'
import { formatDate, nowDate, subtractDate, isSameOrBefore, isSameOrAfter, startOf } from '@utils/dateFormat'
const { proxy } = getCurrentInstance()

const PERIODS = computed(() => [
  { label: proxy.$t('UTI_Month', { month: 6 }), value: '6m' },
  { label: proxy.$t('UTI_Month', { month: 5 }), value: '5m' },
  { label: proxy.$t('UTI_Month', { month: 4 }), value: '4m' },
  { label: proxy.$t('UTI_Month', { month: 3 }), value: '3m' },
  { label: proxy.$t('UTI_Month', { month: 2 }), value: '2m' },
  { label: proxy.$t('UTI_Month', { month: 1 }), value: '1m' }
])
const navigationEndDateMonth = () => {
  return formatDate(endDate.value, 'YYYY/MM')
}
const navigationStartDateMonth = () => {
  return formatDate(startDate.value, 'YYYY/MM')
}
const props = defineProps({
  startDate: {
    type: [Date, String, null, undefined],
    default: ''
  },
  endDate: {
    type: [Date, String, null, undefined],
    default: ''
  },
  type: {
    type: String,
    default: 'date' // month, date, time
  },
  disable: {
    type: Boolean,
    default: false
  },
  showPeriod: {
    type: Boolean,
    default: true
  },
  minDate: {
    type: [Date, String, null, undefined],
    default: undefined
  },
  maxDate: {
    type: [Date, String, null, undefined],
    default: undefined
  },
  showBtnToday: {
    type: Boolean,
    default: true
  },
  isSetDefault: {
    type: Boolean,
    default: true
  },
  period: {
    type: String,
    default: '6m'
  }

})

const startDate = defineModel('startDate')
const endDate = defineModel('endDate')
const period = defineModel('period', { default: '6m' })

const formatInput = computed(() => {
  if (props.type === 'month') {
    return 'YYYY-MM'
  } else if (props.type === 'time') {
    return 'YYYY-MM-DD HH:mm:ss'
  }
  return 'YYYY-MM-DD'
})

onMounted(() => {
  if (props.isSetDefault) {
    init()
  }
})

const init = (period = props.period) => {
  onChangePeriod(period)
}

const optionStartDate = (value) => {
  const format = formatInput.value
  const valueDate = formatDate(value, format)
  if (props.minDate) {
    return (
      valueDate >= formatDate(props.minDate, format) &&
      valueDate <= formatDate(props.maxDate, format)
    )
  }
  if (!endDate.value) return true
  return isSameOrBefore(formatDate(value, format), formatDate(endDate.value, format))
}

/**
 * 마지막 날짜 설정 (오늘 날짜 이후 선택 되지 않도록 추가)
 */
const optionEndDate = (value) => {
  const format = formatInput.value
  const valueDate = formatDate(value, format)
  if (props.minDate) {
    return (
      valueDate >= formatDate(props.minDate, format) &&
      valueDate <= formatDate(props.maxDate, format)
    )
  }
  if (!startDate.value) return true
  return isSameOrAfter(formatDate(value, format), formatDate(startDate.value, format)) && (valueDate <= nowDate(format))
}

const dateHashMap = () => {
  const format = formatInput.value

  const hashMap = {
    '6m': {
      startDate: subtractDate(new Date(), format, { month: 6 }),
      endDate: nowDate(format)
    },
    '5m': {
      startDate: subtractDate(new Date(), format, { month: 5 }),
      endDate: nowDate(format)
    },
    '4m': {
      startDate: subtractDate(new Date(), format, { month: 4 }),
      endDate: nowDate(format)
    },
    '3m': {
      startDate: subtractDate(new Date(), format, { month: 3 }),
      endDate: nowDate(format)
    },
    '2m': {
      startDate: subtractDate(new Date(), format, { month: 2 }),
      endDate: nowDate(format)
    },
    '1m': {
      startDate: subtractDate(new Date(), format, { month: 1 }),
      endDate: nowDate(format)
    }
  }

  for (const key in hashMap) {
    const { startDate, endDate } = hashMap[key]
    const newKey = `${startDate}_${endDate}`
    hashMap[newKey] = key
  }

  return hashMap
}

const onChangePeriod = (value) => {
  if (!value) return

  const hashMap = dateHashMap()

  const data = hashMap[value]
  startDate.value = data.startDate
  endDate.value = data.endDate
}

const onChangeDate = () => {
  const hashMap = dateHashMap()

  const format = formatInput.value
  const _startDate = formatDate(startDate.value, format)
  const _endDate = formatDate(endDate.value, format)
  const key = `${_startDate}_${_endDate}`
  if (hashMap[key]) {
    period.value = hashMap[key]
    return
  }

  period.value = ''
}

watch(
  () => [startDate.value, endDate.value],
  (value) => {
    onChangeDate(value)
  },
  {
    immediate: true
  }
)

defineExpose({
  init
})

</script>

<style lang="scss" scoped>
.datepicker {
  display: flex;
  gap: 10px;

  &__wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.period {
  width: 150px !important;
}
</style>
