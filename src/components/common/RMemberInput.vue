<!--
Member Search Input
create by hbkang (2024-04-04)
-->
<template >
  <RInput v-model="searchText" type="search" @click="onOpenMemberModal()"/>
</template>

<script setup>
import { defineProps, defineModel, ref, getCurrentInstance, defineExpose, watch } from 'vue'
import MemberSearchModal from '@components/modal/MemberSearchModal'

const props = defineProps({
  modelValue: {
    type: [Object, undefined, null],
    default: undefined
  },
  type: {
    type: String,
    default: ''
  }
})

const { proxy } = getCurrentInstance()

const modelValue = defineModel()

const searchText = ref('')
const returnValue = (obj) => {
  modelValue.value = obj.data[props.type]
  searchText.value = `${obj.data['name']}(${obj.data[props.type]})`
}

const init = () => {
  searchText.value = ''
}

// 팝업 오픈 버튼 수행
const onOpenMemberModal = () => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: MemberSearchModal, // 필수
      componentProps: {}, // 선택 - 팝업창에 값 전달
      modeless: false // 선택
    })
    .onOk((modalInfo) => {
      returnValue(modalInfo)
    })
    .onCancel(() => {})
}

watch(
  () => searchText.value,
  (value) => {
    if (value === null) {
      modelValue.value = value
    }
  }
)

defineExpose({
  init
})

</script>
