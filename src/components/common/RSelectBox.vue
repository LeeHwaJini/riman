<!--
  SelectBox Component
  create by yjh (2024-03-08)
-->

<template>
  <q-select
    ref="selectRef"
    v-model="model"
    no-error-icon
    v-bind="props"
    :use-input="isUseInput"
    :hide-selected="isUseInput"
    :fill-input="isUseInput"
    map-options
    stack-label
    emit-value
    :class="props.class"
    :options="option"
    dropdown-icon="keyboard_arrow_down"
    behavior="menu"
    @input="setInputText"
    @update:model-value="onChangeSelect"
    v-on="props.filterable ? {filter: filterFn} : {}"
  >
    <template #prepend>
      <slot name="prepend" />
    </template>
    <template #append>
      <slot name="append" />
    </template>
    <template v-if="placeholderText !== '' && inputText === '' && model === null" #default>
      <div class="text-grey-6" style="position:absolute">{{ props.placeholderText }}</div>
    </template>
    <template v-if="filterable" #no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ $t('SRH_NonResult') }}
        </q-item-section>
      </q-item>
    </template>

    <template #option="scope">
      <q-item :class="props.itemClass" v-bind="scope.itemProps">
        <q-item-section v-if="isOptIcon" avatar>
          <q-icon :name="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label ?scope.opt.label: scope.opt[`${optionLabel }`] }}</q-item-label>
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-if="!props.displayValue" #selected-item="scope">
      <div class="flex justify-between align-center h-full w-full">
        <span>{{ optionLabel?scope.opt[optionLabel] : scope.opt.label }}</span>
        <span v-if="scope.opt.textRight" class="text-right">{{ scope.opt.description }}</span>
      </div>
    </template>
  </q-select>
</template>

<script setup>
import { defineProps, ref, defineModel, defineEmits, watch, onMounted } from 'vue'
const emit = defineEmits(['onChange'])

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  disable: {
    type: Boolean,
    default: false
  },
  filterable: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: undefined
  },
  readonly: {
    type: Boolean,
    default: false
  },
  placeholderText: {
    type: String,
    default: ''
  },
  itemClass: {
    type: Object,
    default: null
  },
  class: {
    type: String,
    default: 'w250'
  },
  isOptIcon: {
    type: Boolean,
    default: false
  },
  optionValue: {
    type: [String, Function],
    required: false
  },
  optionLabel: {
    type: [String, Function],
    required: false
  },
  displayValue: {
    type: String,
    default: null
  }
})

const model = defineModel()
const selectRef = ref(null)

const isUseInput = ref(false)
if (props.filterable) {
  isUseInput.value = true
}

const option = ref(props.options)

watch(
  () => props.options,
  (value) => {
    option.value = value
  }
)

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      option.value = props.options
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    option.value = props.options.filter(item => item.value.toLowerCase().indexOf(needle) > -1)
  })
}

const inputText = ref('')
const setInputText = ($event) => {
  inputText.value = $event.target.value
  selectRef.value.updateInputValue(inputText.value)
}

const onChangeSelect = (e) => {
  emit('onChange', e)
}

const validate = () => {
  selectRef.value.validate()
}

const hasError = () => {
  return selectRef.value.hasError
}

const resetValidation = () => {
  selectRef.value.resetValidation()
}

defineExpose({
  hasError,
  validate,
  resetValidation
})
</script>
