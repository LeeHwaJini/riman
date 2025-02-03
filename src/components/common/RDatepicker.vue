  <!--
달력
create by jhchoi (2024-03-29)
-->
<template>
  <q-input
    v-model="modelValue"
    class="datepicker"
    :placeholder="format"
    :mask="formatMask"
    :is-set-date="isSetDefault"
  >
    <template #append>
      <q-icon :name="`img:${FirstIcon}`" class="cursor-pointer">
        <q-popup-proxy ref="QPopupProxyRef" cover transition-show="scale" transition-hide="scale">

          <div v-if="type === 'time'">
            <div class="flex items-start">
              <q-input
                v-model="inpDate"

                maxlength="10"
                mask="####-##-##"
                borderless
              />
              <q-input
                v-model="inpTime"

                type="time"
                step="1"
                mask="##:##:##"
                borderless/>
            </div>
          </div>

          <q-date
            ref="Qdate"
            v-model="modelValue"
            minimal
            :mask="format"
            :options="fnOption"
            :disable="disable"
            :default-view="defaultView"
            :navigation-max-year-month="navigationMaxYearMonth"
            :navigation-min-year-month="navigationMinYearMonth"
            :years-in-month-view="type === 'month'"
            :emit-immediately="type === 'month'"
            @update:model-value="(_, reason, __)=>onChange(_, reason, __)"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup :label="$t('CM_Close')" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup>
import { defineModel, defineProps, computed, ref, onMounted } from 'vue'
import { date } from 'quasar'
import { nowDate, formatDate } from '@utils/dateFormat'
import FirstIcon from '@/assets/images/icons/ico_date.svg'

const props = defineProps({
  options: {
    type: [Array, Function],
    default: undefined
  },
  disable: {
    type: Boolean,
    default: false
  },
  isSetDefault: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'date' // month, date, time
  },
  /**
   * 오늘 날짜 이후 선택 가능
   */
  isAfterNowDate: {
    type: Boolean,
    default: false
  },
  /**
   * 오늘 날짜 이전 선택 가능
   */
  isBeforeNowDate: {
    type: Boolean,
    default: false
  },
  navigationMaxYearMonth: {
    type: String,
    default: undefined
  },
  navigationMinYearMonth: {
    type: String,
    default: undefined
  }
})
const modelValue = defineModel()

const defaultView = ref('Calendar')
const format = ref('YYYY-MM-DD')

if (props.type === 'month') {
  defaultView.value = 'Months'
  format.value = 'YYYY-MM'
}

if (props.type === 'time') {
  format.value = 'YYYY-MM-DD HH:mm:ss'
}

const formatMask = computed(() => format.value.replace(/[a-zA-Z]/g, '#'))

const fnOption = (value) => {
  if (props.isAfterNowDate) {
    return formatDate(value, format.value) >= nowDate(format.value)
  } else if (props.isBeforeNowDate) {
    return formatDate(value, format.value) <= nowDate(format.value)
  } else if (props.options) {
    return props.options(value)
  }
  return true
}

onMounted(() => {
  if (props.isSetDefault) {
    const defaultDate = nowDate(format.value)
    modelValue.value = defaultDate
  }
})

const QPopupProxyRef = ref()
const Qdate = ref()
const onChange = (_, reason, __) => {
  if (props.type === 'month') {
    if (reason === 'month') {
      QPopupProxyRef.value.hide()
    } else if (reason === 'year') {
      Qdate.value.setView('Months')
    }
  } else if (props.type === 'date') {
    QPopupProxyRef.value.hide()
  }
}

const inpDate = computed({
  get() {
    return modelValue.value.substring(0, 10)
  },
  set(value) {
    if (value.length !== 10) {
      return
    }
    const dateValue = date.formatDate(modelValue.value, `${value} 00:00:00`)
    modelValue.value = dateValue
  }
})

const inpTime = computed({
  get() {
    return modelValue.value.substring(11)
  },
  set(value) {
    const dateValue = date.formatDate(modelValue.value, `YYYY-MM-DD ${value}`)
    modelValue.value = dateValue
  }
})
</script>

<style lang="scss" scoped>

</style>
