<!--
체크박스 그룹
create by jhchoi (2024-4-01)
-->
<template>
  <q-checkbox
    v-if="isAllText"
    v-model="allValue"
    :class="allChkClass"
    :label="$t('CM_All')"
  />

  <q-checkbox
    v-for="(item, index) in options"
    v-bind="props"
    :key="index"
    v-model="model"
    :val="item.value"
    :label="item.label"
    :disable="max !== -1 && checkDisable(item)"
    :class="subChkClass"
  />
</template>

<script setup>
import { defineProps, defineModel, ref, watch, onMounted, compile, computed } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  disable: {
    type: Boolean,
    default: false
  },
  isAllText: {
    type: Boolean,
    default: true
  },
  max: {
    type: Number,
    default: -1
  },
  allChkClass: {
    type: String,
    default: ''
  },
  subChkClass: {
    type: String,
    default: ''
  }
})

const model = defineModel()

const oOptionValue = props.options.map(obj => obj.value) // ['aaa', 'bbb']

const allValue = computed({
  set(v) {
    if (v) {
      model.value = oOptionValue
    } else {
      model.value = []
    }
  },
  get() {
    if (model.value.length === oOptionValue.length) {
      return true
    } else {
      return false
    }
  }
})

const checkDisable = (item) => {
  const notChecked = Object.values(model.value).indexOf(item.value) < 0
  if (model.value.length >= props.max && notChecked) {
    return true
  } else {
    return false
  }
}

</script>
