<template>
  <div class="center-wrap">
    <div class="center-search-area">
      <div class="title-area">
        <h3>{{ $t('CS_FindCenter') }}</h3>

        <!-- <div class="notice-search">
          <div class="input-search type02">
            <RInput v-model="keyword" :placeholder="$t('CM_EnterKeyword')" class="login-input login-input--id " @keyup.enter=""/>
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
            :placeholder-text="$t('CM_All')"
            :options="allList"
            option-value=""
            option-label=""
            class="select-box type04"
          />

          <RSelectBox
            v-model="select"
            :placeholder-text="$t('CS_District1')"
            :options="allList"
            option-value=""
            option-label=""
            class="select-box type04"
          />

          <RSelectBox
            v-model="select"
            :placeholder-text="$t('CS_District2')"
            :options="allList"
            option-value=""
            option-label=""
            class="select-box type04"
          />
        </div> -->
      </div>

      <ul class="center-map-list scroll type01">
        <li v-for="(item, index) in centerList" :key="item" :class="{'active' : 0}" @click="setSelectedCenter(item, index)">
          <h5 class="center-name-text">{{ item.branchName }}</h5>
          <div class="center-address-text">
            <span>{{ item.address1 }} {{ item.address2 }} {{ item.address3 }}</span>
          </div>
          <div class="center-ph-text">{{ item.tel }}</div>
        </li>
      </ul>
    </div>

    <div id="map" class="center-map-area">
      <div
        v-if="selectedCenter"
        class="map-tooltip-area"
        :style="{
          left: isMobile ? '53%' : '51%',
          top: isMobile ? '5%' : '15%',
          transform: 'translateX(-50%)',
          zIndex: 50
        }">
        <h5 class="center-name-text">{{ selectedCenter.branchName }}</h5>
        <div class="center-address-text">
          <span>{{ selectedCenter.address1 }} {{ selectedCenter.address2 }} {{ selectedCenter.address3 }}</span>
        </div>
        <div class="center-ph-text">{{ selectedCenter.tel }}</div>

        <!-- 이미지는 오픈 이후 추가 예정 -->
        <!-- <div class="img-area">
          <img src="@assets/images/temp/prd_list.png" alt="" class="">
          <img src="@assets/images/temp/prd_list.png" alt="" class="">
          <img src="@assets/images/temp/prd_list.png" alt="" class="">
        </div> -->
      </div>
    </div>
  </div>

  <!-- <router-link to="center/search" class="search-filter-btn btn type02 small">
    {{ $t('CS_SearchFilter') }}
    <i class="ico search-w" />
  </router-link> -->
</template>

<script setup>
import customerService from '@/http/services/customer'
import { computed, getCurrentInstance, onMounted, ref } from 'vue'

import pinIcon from '@assets/images/map_maker.svg'

// const keyword = ref('')
const centerList = ref([])
const selectedCenter = ref(undefined)

const { proxy } = getCurrentInstance()
const isMobile = computed(() => proxy.$isMobile())

onMounted(() => {
  setMap()

  getCenterList()
})

const getCenterList = async () => {
  const result = await customerService.getCenterList()

  if (result) {
    centerList.value = result.data
  }
}
const setMap = (index) => {
  const script = document.createElement('script')
  script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=cy1mzzik9w&submodules=geocoder'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
  script.onload = () => {
    if (index === undefined) {
      new window.naver.maps.Map(document.getElementById('map'))
    } else {
      const address = centerList.value[index].address2 + ' ' + centerList.value[index].address3

      window.naver.maps.Service.geocode({ query: address }, function (status, response) {
        const mapData = response.v2.addresses[0]
        const position = new window.naver.maps.LatLng(Number(mapData.y), Number(mapData.x))

        const map = new window.naver.maps.Map('map', { center: position, zoom: 17 })

        const markerOptions = {
          position: position.destinationPoint(0, 0),
          map,
          icon: {
            url: pinIcon,
            size: new window.naver.maps.Size(64, 64),
            origin: new window.naver.maps.Point(0, 0),
            anchor: new window.naver.maps.Point(17, 27)
          }
        }
        new window.naver.maps.Marker(markerOptions)
      })
    }
  }
}

const setSelectedCenter = (center, index) => {
  selectedCenter.value = center
  setMap(index)
}

</script>

<style lang="scss" scoped>
// 검색 기능 추가 시 아래 코드 삭제 필요
.center-map-list {
  max-height: calc(100%);
}
</style>
