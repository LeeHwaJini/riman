<template>
  <RTabs v-model="eventTab" :tab-list="tabList" class="tab type04"/>
  <q-tab-panels v-model="eventTab" class="tab-list type04">
    <q-tab-panel name="progress">
      <ul v-if="props.eventIsProgressData && props.eventIsProgressData.list.length > 0" class="grid-list type03">
        <li v-for="item in props.eventIsProgressData.list" :key="item.eventId">
          <div class="img-area" @click="router.push(`/update/event/${item.eventId}?isInProgress=${eventTab === 'progress'}&sortType=NEWEST`)">
            <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
            <!-- 사용 안 할 경우 제거 -->

            <div class="prd-icon-area notic-icon-area">
              <span v-if="isRecentItem(item.eventStartDate, 14)" class="prd-icon new">NEW</span>
              <span v-if="getDday(item.eventdDate) > 5 && getDday(item.eventEndDate) <= 30" class="prd-icon date">D-{{ getDday(item.eventEndDate) }}</span>
              <span v-if="getDday(item.eventEndDate) <= 5" class="prd-icon deadline">{{ getDday(item.eventEndDate) === 0 ? $t('UP_EndToday') : $t('UP_EndSoon') }}</span>
            </div>
            <!-- //사용 안 할 경우 제거 -->
          </div>

          <div class="event-title">{{ item.eventName }}</div>

          <span class="event-date">{{ item.eventPeriod }}</span>
        </li>
      </ul>
      <!-- 결과 없을경우 -->
      <div v-else class="cart-none-area faq-none-area">
        <img src="@assets/images/search_none.svg" alt="">
        <p class="title">{{ $t('SRH_NonResult') }}</p>
        <ul class="result-none-text-area max-w186">
          <li>{{ $t('SCH_CheckWrongInput') }}</li>
          <li>{{ $t('SCH_SearchOther') }}</li>
        </ul>
      </div>
    </q-tab-panel>

    <q-tab-panel name="progressEnd">
      <ul v-if="props.eventNotProgressData && props.eventNotProgressData.list.length > 0" class="grid-list type03">
        <li v-for="item in props.eventNotProgressData.list" :key="item.eventId">
          <div class="img-area" @click="router.push(`/update/event/${item.eventId}?isInProgress=${eventTab === 'progress'}&sortType=NEWEST`)">
            <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
            <!-- 종료된 이벤트일 경우 추가 -->
            <div class="w-dim-area" />
            <!-- //종료된 이벤트일 경우 추가 -->
          </div>

          <div class="event-title">{{ item.eventName }}</div>

          <span class="event-date">{{ item.eventPeriod }}</span>
        </li>
      </ul>
      <!-- 결과 없을경우 -->
      <div v-else class="cart-none-area faq-none-area">
        <img src="@assets/images/search_none.svg" alt="">
        <p class="title">{{ $t('SRH_NonResult') }}</p>
        <ul class="result-none-text-area max-w186">
          <li>{{ $t('SCH_CheckWrongInput') }}</li>
          <li>{{ $t('SCH_SearchOther') }}</li>
        </ul>
      </div>
    </q-tab-panel>

  </q-tab-panels>

</template>

<script setup>
import { addPrefixForImage, isRecentItem } from '@/utils/common'
import { getDday } from '@/utils/dateFormat'
import { computed, getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const props = defineProps({
  eventIsProgressData: {
    type: Object,
    default: null
  },
  eventNotProgressData: {
    type: Object,
    default: null
  }
})
const eventTab = ref('progress')
const router = useRouter()
const tabList = computed(() => [
  { label: proxy.$t('UP_InProgressEvent'), name: 'progress' },
  { label: proxy.$t('UP_EndedEvent'), name: 'progressEnd' }
])
</script>
