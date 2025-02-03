<!--
NumberSpin Component
create by wsna (2023-07-06)
-->
<template>
  <div class="q-pa-md">
    <div class="flex items-center">
      <q-btn padding="xs" icon="remove" :disable="isMinusBtn" class="disable-zoom" @click="countMinus"/>
      <span>
        <q-input v-model="model" type="Number" maxlength="3" outlined :readonly="isReadonly" @keypress="onKeypress($event)" @blur="onblur"/>
      </span>
      <q-btn padding="xs" icon="add" :disable="isPlusBtn" class="disable-zoom" @click="countPlus"/>
    </div>
  </div>
</template>

<script setup>
import { defineModel, defineProps, watch, ref } from 'vue'

const props = defineProps({
  modelValue: { // 부모의 v-model info
    type: Number,
    required: true,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: -1
  },
  isReadonly: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  }
})

const model = defineModel()
const emit = defineEmits(['onChangeValue'])
const onKeypress = (evt) => {
  if (evt.keyCode >= 48 && evt.keyCode <= 57) {
    return true // Number true
  } else {
    evt.preventDefault()
  }
}

const onblur = () => {
  const regex = /[0-9]/
  if (!regex.test(model.value) || !Number(model.value) || Number(model.value) === 0) {
    model.value = 1
  } else {
    model.value = Number(model.value)
  }

  if (props.max !== -1 && props.max <= model.value) {
    model.value = props.max
  }

  if (props.min >= model.value) {
    model.value = props.min
  }
  emit('onChangeValue', model.value)
}

const countPlus = () => {
  model.value = model.value + 1
  emit('onChangeValue', model.value)
}

const countMinus = () => {
  model.value = model.value - 1
  emit('onChangeValue', model.value)
}
const isMinusBtn = ref(true)
const isPlusBtn = ref(false)

watch(
  () => model.value,
  (newValue, oldValue) => {
    if (props.max !== -1 && props.max <= newValue) {
      isPlusBtn.value = true
    } else {
      isPlusBtn.value = false
    }

    if (props.min >= newValue) {
      isMinusBtn.value = true
    } else {
      isMinusBtn.value = false
    }
  }, { immediate: true }
)

watch(
  () => [props.disable],
  () => {
    if (props.disable) {
      isMinusBtn.value = true
      isPlusBtn.value = true
    }
  }, { immediate: true }
)

</script>
