<template>
  <div class="breadcrumb">
    <img class="home-icon" src="@/assets/images/ico_home.svg" alt="home" @click="router.push('/')"/>
    <template v-if="proxy.$isMobile()">
      <img src="@/assets/images/ico_threedots.svg" alt="dots" />
    </template>
    <template v-else>
      <RSelectBox
        v-model="currentDepth1"
        class="select-box type06"
        :options="rootOptions"
        popup-content-class="breadcrumb-popup"
      />
    </template>
    <RSelectBox
      :model-value="currentDepth2"
      :options="options"
      class="select-box type06 breadcrumb-select depth2"
      popup-content-class="breadcrumb-popup"
      @update:model-value="onChangeDepth2"
    />
    <RSelectBox
      :model-value="currentDepth3"
      :options="options.filter(option => option.value === currentDepth2)[0].children"
      popup-content-class="breadcrumb-popup"
      class="select-box type06  breadcrumb-select depth3"
      @update:model-value="onChangeDepth3"
    />
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const rootOptions = [
  { value: 'riman', label: '리만 스토리' }
]
const options = [
  { value: 'about', label: '기업소개', path: '/about/ev', children: [
    { value: 'ev', label: '기업가치', path: '/about/ev' },
    { value: 'history', label: '우리의 발자취', path: '/about/history' },
    { value: 'rnd', label: 'R&D', path: '/about/rnd' }
  ] },
  { value: 'esg', label: '지속가능경영', path: '/esg/fair', children: [
    { value: 'fair', label: '공정거래', path: '/esg/fair' },
    { value: 'ethics', label: '윤리준법경영', path: '/esg/ethics' },
    { value: 'customer', label: '소비자중심경영', path: '/esg/customer' },
    { value: 'safety', label: '안전보건경영', path: '/esg/safety' },
    { value: 'compliance', label: '사이버신고센터', path: '/esg/compliance' }
  ] }
]
const currentDepth1 = ref('riman')
const currentDepth2 = ref(route.path.split('/')[1] === 'about' ? 'about' : 'esg')
const currentDepth3 = ref(options.filter(option => option.value === currentDepth2.value)[0].children.filter(iOption => iOption.path === route.path)[0])
const onChangeDepth2 = (value) => {
  currentDepth2.value = value
  currentDepth3.value = options.filter(option => option.value === currentDepth2.value)[0].children[0].value
  router.push(options.filter(options => options.value === value)[0].path)
}
const onChangeDepth3 = (value) => {
  const path = options.filter(option => option.value === currentDepth2.value)[0].children.filter(iOption => iOption.value === value)[0].path
  router.push(path)
}
</script>

<style lang="scss" scoped>

</style>
