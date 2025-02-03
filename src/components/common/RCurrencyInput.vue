<template>
  <q-input
    ref="inputRef"
    v-model.lazy="formattedValue"
    outlined
  />
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input'
import { defineProps, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  maxValue: {
    type: Number,
    default: 0
  }
})

const {
  inputRef,
  formattedValue,
  setValue,
  setOptions
} = useCurrencyInput(
  {
    currency: 'USD',
    currencyDisplay: 'hidden',
    hideCurrencySymbolOnFocus: false,
    hideGroupingSeparatorOnFocus: false,
    precision: 0
  }
)

watch(
  () => props.modelValue,
  (value) => {
    setValue(value)
  }
)

watch(
  () => props.maxValue,
  (maxValue) => {
    setOptions(
      {
        currency: 'USD',
        currencyDisplay: 'hidden',
        hideCurrencySymbolOnFocus: false,
        hideGroupingSeparatorOnFocus: false,
        precision: 0,
        valueRange: { max: maxValue, min: 0 }
      }
    )
  }
)
</script>
