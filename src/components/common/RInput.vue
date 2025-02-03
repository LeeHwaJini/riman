<!--
인풋
create by jhchoi (2024-4-01)
-->
<template>
  <q-input
    ref="inputRef"
    v-model.trim="model"
    v-bind="props"
    :type="setType"
    :maxlength="maxlength"
    :readonly="setReadonly"
    no-error-icon
    @focus="focusInp=true"
    @blur="focusInp=false"
    @update:model-value="input"
  >
    <template #prepend>
      <slot name="prepend" />
    </template>
    <template #append>
      <slot name="append" />
      <q-icon v-if="isClear" name="close" :style="{'visibility':(type === 'search' || focusInp) && model? 'visible': 'hidden'}" size="xs" @click.stop.prevent="model = ''"/>
      <q-icon v-if="setIcon" :name="setIcon"/>
      <q-icon
        v-if="type === 'togglePassword'"
        :name="isShowPw ? 'visibility' :'visibility_off' "
        class="cursor-pointer"
        @click="isShowPw = !isShowPw"
      />
    </template>
  </q-input>
</template>

<script setup>
import { defineProps, defineModel, ref, watch, defineEmits } from 'vue'

const props = defineProps({
  class: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  mask: {
    type: String,
    default: ''
  },
  rules: {
    type: Array,
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  },
  stackLabel: {
    type: Boolean,
    default: true
  },
  isClear: {
    type: Boolean,
    default: true
  },
  maxlength: {
    type: String,
    default: ''
  }
})
const model = defineModel()
const focusInp = ref(false)

const isShowPw = ref(false)
const setType = ref(props.type)
const inputRef = ref()

const validate = async () => {
  return await inputRef.value.validate()
}

const hasError = () => {
  return inputRef.value.hasError
}

const resetValidation = () => {
  inputRef.value.resetValidation()
}

const focus = () => {
  return inputRef.value.focus()
}

const emit = defineEmits(['onInput'])
const input = (e) => {
  emit('onInput', e)
}

if (props.type === 'togglePassword') {
  setType.value = 'password'
}
watch(
  () => isShowPw.value,
  (value) => {
    if (value) {
      setType.value = 'text'
    } else {
      setType.value = 'password'
    }
  }
)

const setIcon = ref(props.icon)
if (props.type === 'search') {
  setIcon.value = 'search'
}

const setReadonly = ref(props.readonly)
if (props.type === 'search') {
  setReadonly.value = true
}
watch(
  () => props.readonly,
  (value) => {
    setReadonly.value = value
  }
)

defineExpose({
  hasError,
  validate,
  resetValidation,
  focus
})

</script>
