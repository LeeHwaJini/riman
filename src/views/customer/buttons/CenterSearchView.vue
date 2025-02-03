<template>
  <div class="mo-center-search-area">
    <div class="center-search-area">
      <div class="title-area">
        <div class="notice-search">
          <div class="input-search type02">
            <RInput v-model="keyword" placeholder="키워드를 검색해 주세요." class="login-input login-input--id " @keyup.enter=""/>
            <RButton label="" @click="">
              <template #content>
                <i class="ico search-g"></i>
              </template>
            </RButton>
          </div>
        </div>

        <div class="select-area">
          <RSelectBox
            v-model="select"
            placeholder-text="전체"
            :options="allList"
            option-value=""
            option-label=""
            class="select-box type04"
          />

          <RSelectBox
            v-model="select"
            placeholder-text="시/도"
            :options="allList"
            option-value=""
            option-label=""
            class="select-box type04"
          />

          <RSelectBox
            v-model="select"
            placeholder-text="시/군/구"
            :options="allList"
            option-value=""
            option-label=""
            class="select-box type04"
          />
        </div>
      </div>

      <ul class="center-map-list">
        <li v-for="item in 20" :key="item" :class="{'active' : 0}">
          <h5 class="center-name-text">선릉 HUB</h5>
          <div class="center-address-text">서울특별시 강남구 테헤란로 77길 17 승광빌딩 3층</div>
          <div class="center-ph-text">010 9578 1010</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, getCurrentInstance, reactive } from 'vue'
const keyword = ref('')

</script>

<style lang="scss" scoped>

</style>
