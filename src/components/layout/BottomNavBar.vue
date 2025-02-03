<!--
  Bottom Navi bar
  create by jhchoi
-->
<template>
  <nav v-if="isTablet" class="bottom-nav-bar-area">
    <ul v-if="isPlanner">
      <li>
        <a :href="VITE_APP_RBO_URL">
          {{ $t('CM_TabRbo') }}
          <i class="ico byeongpul"/>
        </a>
      </li>
      <li :class="{'active': isActiveClass('/product/all_products', 'path')}" @click="router.push('/product/all_products')">
        {{ $t('CM_AllProduct') }}
        <i class="ico byeongpul"/>
      </li>
      <li :class="{'active': isActiveClass('Home')}" @click="router.push('/')">
        {{ $t('NAV_Home') }}
        <i class="ico byeongpul"/>
      </li>
      <li :class="{'active': isActiveClass('MyPageMain')}" @click="router.push('/mypage')">
        {{ $t('NAV_Mypage') }}
        <i class="ico byeongpul"/>
      </li>
      <li @click="openMenu">
        {{ $t('CM_Menu') }}
        <i class="ico byeongpul"/>
      </li>
    </ul>

    <ul v-else>
      <li :class="{'active': isActiveClass('/product/bestsellers', 'path')}" @click="router.push('/product/bestsellers')">
        {{ isPlanner ? $t('CM_TabRbo') : $t('CM_Best') }}
        <i class="ico byeongpul"/>
      </li>
      <li :class="{'active': isActiveClass('/product/all_products', 'path')}" @click="router.push('/product/all_products')">
        {{ $t('CM_AllProduct') }}
        <i class="ico byeongpul"/>
      </li>
      <li :class="{'active': isActiveClass('Home')}" @click="router.push('/')">
        {{ $t('NAV_Home') }}
        <i class="ico byeongpul"/>
      </li>
      <li :class="{'active': isActiveClass('MyPageMain')}" @click="router.push('/mypage')">
        {{ $t('NAV_Mypage') }}
        <i class="ico byeongpul"/>
      </li>
      <li @click="openMenu">
        {{ $t('CM_Menu') }}
        <i class="ico byeongpul"/>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import { checkPlanner } from '@/utils/common'
import { useRouter, useRoute } from 'vue-router'

const { proxy } = getCurrentInstance()
const isTablet = computed(() => proxy.$isTablet())
const isPlanner = computed(() => checkPlanner())
const router = useRouter()
const route = useRoute()

const VITE_APP_RBO_URL = import.meta.env.VITE_APP_RBO_URL

const openMenu = () => {
  window.dispatchEvent(new Event('openMenu'))
}
const isActiveClass = (val, type = 'name') => {
  if (type === 'path') {
    return route.path === val
  }
  return route.name === val
}
</script>
