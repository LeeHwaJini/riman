<!--
  Botton Go Top
  create by jhchoi
-->
<template>
  <div class="floating-menu-area">
    <button v-if="isOneDepthMenu" class="btn type17" @click="router.push('/customer')"><i class="ico cs"></i></button>
    <div class="btn-area">
      <button class="btn" @click="scrollTop">
        <i class="ico arrow-top-w"></i>
      </button>
      <button class="btn" @click="scrollBottom">
        <i class="ico arrow-bottom-w"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const oneDepthMenu = ['ProductList', 'Search', 'EnterpriseValue', 'History', 'Rnd', 'Compliance', 'Customer', 'Ethics', 'FairTrade', 'Safety']
const isOneDepthMenu = computed(() => oneDepthMenu.indexOf(route.name) > -1 || route.path === '/')

const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const scrollBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
}
</script>
