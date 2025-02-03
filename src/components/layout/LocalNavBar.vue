<!--
  LNB : Local Navigation Bar (pc menu)
  create by jhchoi
-->
<template>
  <aside class="side-menu-wrap active">
    <div class="side-menu-container">
      <div class="menu-wrap">
        <div class="menu-area">
          <div class="menu-content">
            <ul class="categroy-name-area scroll type01">
              <li>
                <span class="main-text success04-color" @click="onSignup" @mouseover="handleFirstMenu">{{ $t('CM_DoSignup') }}</span>
              </li>
              <li
                v-for="menu in categories"
                :key="menu.categoryName"
                @mouseover="showChildMenu(menu)"
                @click="gotoProductByCategory(menu)"
              >
                <span class="main-text">{{ menu.categoryName }}</span>
              </li>

            </ul>
            <div class="categroy-column-list-area">
              <ul v-for="menuDepthTwo in currentMenu?.children" :key="menuDepthTwo.id">
                <li><b>{{ menuDepthTwo.categoryName }}</b></li>
                <li
                  v-for="menuDepthThree in menuDepthTwo?.children"
                  :key="menuDepthThree.id"
                >
                  <span @click="gotoProductByCategory(menuDepthThree)">
                    {{ menuDepthThree.categoryName }}
                  </span>
                </li>
                <li v-if="menuDepthTwo.parentId !== '9999999999'"><a href="javascript::void(0)" @click="gotoProductByCategory(menuDepthTwo)">{{ $t('CM_AllCategory') }}</a></li>
              </ul>
            </div>

          </div>

          <ul class="bottom-menu-area">
            <li @click="goPage('/update')">{{ $t('NAV_NoticeAndEvent') }}</li>
            <li v-if="isDivein" @click="goPage('/divein')">{{ $t('ORD_DiveIn') }}</li>

            <template v-if="!isLogin()">
              <li @click="goPage('/signup/selectType')">{{ $t('CM_DoSignup') }}</li>
              <li @click="onClickLogin">{{ $t('NAV_Login') }}</li>
            </template>
            <template v-else>
              <li @click="goPage('/mypage')">{{ $t('NAV_Mypage') }}</li>
              <li @click="onClickLogout">{{ $t('CM_Logout') }}</li>
            </template>

            <li>
              <div class="input-search type03">
                <RInput v-model="inputText" :placeholder="currentPlaceholder" class="login-input login-input--id " @keyup.enter="onSearch"/>
                <RButton class="" label="" @click="onSearch">
                  <template #content>
                    <i class="ico search"></i>
                  </template>
                </RButton>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div class="slide-area">
        <swiper
          v-if="gnbList"
          :direction="'vertical'"
          :modules="modules"
          :slides-per-view="'auto'"
          :pagination="{
            clickable: true,
          }"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false
          }"
          :loop="true"
          :free-mode="true"
          class="mySwiper">
          <swiper-slide v-for="item in gnbList" :key="item.id">
            <img :src="addPrefixForImage(item.imageUrl)" alt="" :class="['img-cover', {'with-link': item.link}]" @click="onClickGnbImage(item.link)">
          </swiper-slide>
        </swiper>
      </div>

      <button class="menu-close-btn" @click="emit('closeMenu')">
        <i class="ico close-w" />
      </button>

    </div>

  </aside>
</template>

<script setup>
import { ref, watch, getCurrentInstance, onMounted, onBeforeUnmount, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode } from 'swiper/modules'
import { langOptions } from '@utils/selectOptions'
import { isLogin } from '@utils/login'
import productService from '@/http/services/product'
import { useMainStore } from '@store/mainStore'

const { proxy } = getCurrentInstance()
const { data: categories, isSuccess } = productService.getNestedCategoryList()
const modules = [Pagination, FreeMode, Autoplay]
import { useRouter } from 'vue-router'
import etcService from '@/http/services/etc'
import { isSameOrAfter, isSameOrBefore } from '@/utils/dateFormat'
import { addPrefixForImage } from '@/utils/common'

const emit = defineEmits([
  'closeMenu'
])

const inputText = ref('')
const lang = ref(null)

const currentMenu = ref({})
const gnbList = ref(undefined)
const defaultGnbList = ref(undefined)

const mainStore = useMainStore()
const router = useRouter()
const isDivein = import.meta.env.VITE_APP_IS_DIVEIN === 'true'

watch(
  () => isSuccess.value,
  () => {
    currentMenu.value = categories.value[0]
  }
)

watch(
  () => currentMenu.value,
  () => {
    getMainGnb(currentMenu.value?.categoryId)
  }
)

const showChildMenu = (menu) => {
  currentMenu.value = menu
}

const handleFirstMenu = () => {
  currentMenu.value = null
  defaultGnbList.value = gnbList.value
}

const gotoProductByCategory = (menu) => {
  proxy.$emit('closeMenu')
  return router.push({ path: menu.path })
}

const goPage = (url) => {
  proxy.$emit('closeMenu')
  router.push(url)
}

const onSearch = () => {
  proxy.$emit('closeMenu')
  router.push({
    name: 'Search',
    query: {
      keyword: inputText.value
    }
  })
}
const onClickLogout = async () => {
  proxy.$confirm(proxy.$t('CNF_Logout'), {
    title: '',
    ok: async function () {
      const result = await mainStore.onLogout()
      if (result) {
        proxy.$emit('closeMenu')
        router.push({ name: 'Home' })
      }
    },
    okLabel: proxy.$t('CNF_OKLogout'),
    cancelLabel: proxy.$t('CM_No')
  })
}

const onClickLogin = () => {
  router.push('/login')
  proxy.$emit('closeMenu')
}

const currentPlaceholder = ref('')
const placeholders = computed(() => {
  return proxy.$t('CM_SearchComment').split('').map((_, i, arr) =>
    arr.slice(0, i + 1).join('')
  )
})
let index = 0
let timeoutId = null

const updatePlaceholder = () => {
  currentPlaceholder.value = placeholders.value[index]
  index = (index + 1) % placeholders.value.length
  timeoutId = setTimeout(updatePlaceholder, 200)
}

const getMainGnb = async (categoryId) => {
  if (!categoryId && defaultGnbList.value) {
    return
  }
  if (categoryId === '9999999999') return
  const param = {
    categoryId
  }

  const result = await etcService.getMainGnb(param)

  if (result) {
    gnbList.value = result.data.filter(i => isSameOrBefore(new Date(i.period.start), new Date()) && i.period.end ? isSameOrAfter(new Date(i.period.end), new Date()) : true && i.display)
  }

  if (categoryId === categories.value[0].categoryId) {
    defaultGnbList.value = gnbList.value
  }
}

const onClickGnbImage = (link) => {
  if (!link) return
  router.push(link)
  proxy.$emit('closeMenu')
}

onMounted(() => {
  if (categories?.value) {
    getMainGnb(categories.value[0].categoryId)
  }

  updatePlaceholder()
})

onBeforeUnmount(() => {
  clearTimeout(timeoutId)
})

/**
 * 가입하기 버튼 클릭 시 호출
 */
const onSignup = () => {
  if (!isLogin()) {
    proxy.$emit('closeMenu')
    router.push('/signup/selectType')
  } else {
    proxy.$confirm(proxy.$t('CNF_LogoutSignup'), {
      title: '',
      ok: async function () {
        const result = await mainStore.onLogout()
        if (result) {
          proxy.$emit('closeMenu')
          router.push({ name: 'Home' })
        }
      },
      okLabel: proxy.$t('CM_yes'),
      cancelLabel: proxy.$t('CM_No')
    })
  }
}

</script>
<style lang="scss" scoped>
.with-link {
  cursor: pointer;
}
</style>
