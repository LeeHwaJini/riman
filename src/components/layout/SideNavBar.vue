<!--
  SNB : Side Navigation Bar (mobile menu)
-->
<template>
  <q-dialog
    v-model="modelValue"
    position="right"
    no-esc-dismiss
    no-backdrop-dismiss
    class="full-page-modal"
  >
    <q-card class="mo-side-menu-wrap active">
      <div ref="sideMenu" class="mo-side-menu-container">
        <button class="mo-menu-close-btn" @click="onClickCloseMenu"><i class="ico close" /></button>

        <div class="mo-side-menu-content">

          <div class="input-search type01">
            <RInput v-model="inputText" :placeholder="currentPlaceholder" class="login-input login-input--id " @keyup.enter="onSearch"/>
            <RButton label="" @click="onSearch">
              <template #content>
                <i class="ico search"></i>
              </template>
            </RButton>
          </div>

          <ul class="mo-menu-area">
            <li class="mo-menu-text pointer" @click="onSignup" @mouseover="handleFirstMenu">{{ $t('CM_DoSignup') }}</li>
            <li
              v-for="menu in categories"
              :key="menu.categoryName"
              @mouseover="getMainGnb(menu.categoryId)"
            >
              <q-expansion-item
                expand-separator
                :label="menu.categoryName"
                :expand-icon="menu?.children?.length > 0 ? `img:${AddIcon}`: 'none'"
                :expanded-icon="menu?.children?.length > 0 ?`img:${SubtractIcon}`: 'none'"
                group="setAccordion"
                @click.stop.prevent="onClickMenu($event, menu)"
              >
                <nav class="mo-sub-menu-area">
                  <ul v-for="menuDepthTwo in menu?.children" :key="menuDepthTwo.id">
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
                </nav>
              </q-expansion-item>
            </li>
          </ul>

          <ul class="mo-bottom-menu-area">
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
          </ul>
        </div>

        <div class="mo-slide-area">
          <swiper
            :modules="modules"
            :slides-per-view="'1'"
            :pagination="{
              type: 'fraction',
              clickable: true,
              renderFraction: (currentClass, totalClass) => {
                return `<div class='pagenation type02'><span class='${currentClass}'></span><span class='${totalClass}'</span></div>`;
              }
            }"
            :autoplay="{
              delay: 5000,
              disableOnInteraction: false,
            }"
            :loop="true"
            :free-mode="true"
            class="swiper">
            <swiper-slide v-for="item in gnbList" :key="item.id">
              <img :src="addPrefixForImage(item.imageUrl)" alt="" :class="['img-cover', {'with-link': item.link}]" @click="onClickGnbImage(item.link)">
            </swiper-slide>
          </swiper>
        </div>

      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, getCurrentInstance, onBeforeUnmount, onMounted, computed, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode } from 'swiper/modules'
import { useMainStore } from '@store/mainStore'
import { useRouter } from 'vue-router'
import { isLogin } from '@utils/login'
import { isSameOrAfter, isSameOrBefore } from '@/utils/dateFormat'
import { addPrefixForImage } from '@/utils/common'
import AddIcon from '@/assets/images/icons/ico_add.svg'
import SubtractIcon from '@/assets/images/icons/ico_subtract.svg'
import productService from '@/http/services/product'
import etcService from '@/http/services/etc'

const modules = [Pagination, FreeMode, Autoplay]
const mainStore = useMainStore()
const { data: categories } = productService.getNestedCategoryList()

const modelValue = defineModel()
const gnbList = ref(undefined)
const defaultGnbList = ref(undefined)
const isDivein = import.meta.env.VITE_APP_IS_DIVEIN === 'true'

const sideMenu = ref(null)

const onClickCloseMenu = () => {
  modelValue.value = false
}

const inputText = ref('')
const { proxy } = getCurrentInstance()
const router = useRouter()

const goPage = (url) => {
  proxy.$emit('closeMenu')
  router.push(url)
}

/**
 * 메뉴 이동
 * @param e
 * @param menu
 */
const onClickMenu = (e, menu) => {
  if (e.target.localName === 'div') {
    gotoProductByCategory(menu)
  } else {
    /**
     * + 아이콘 클릭 시, 클릭 한 메뉴 맨위에 보이도록 수정
     */

    setTimeout(() => {
      const svgRect = e.target.getBoundingClientRect()
      const scrollPosY = parseInt(svgRect.top - 40 + sideMenu.value.scrollTop)
      sideMenu.value.scrollTo({
        top: scrollPosY,
        behavior: 'smooth'
      })
    }, 350)
  }
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

const handleFirstMenu = () => {
  // currentMenu.value = null
  defaultGnbList.value = gnbList.value
}

const gotoProductByCategory = (menu) => {
  onClickCloseMenu()
  return router.push({ path: menu.path })
}

const onClickLogin = () => {
  router.push('/login')
  onClickCloseMenu()
}

const onClickLogout = async () => {
  proxy.$confirm(proxy.$t('CNF_Logout'), {
    title: '',
    ok: async function () {
      const result = await mainStore.onLogout()
      if (result) {
        onClickCloseMenu()
        router.push({ name: 'Home' })
      }
    },
    okLabel: proxy.$t('CNF_OKLogout'),
    cancelLabel: proxy.$t('CM_No')
  })
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
}

const getMainGnb = async (categoryId) => {
  if (defaultGnbList.value) {
    return
  }

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

watch(
  () => categories.value,
  (v) => {
    if (v) {
      getMainGnb(v[0].categoryId)
    }
  }
)

onMounted(() => {
  if (categories?.value) {
    getMainGnb(categories.value[0].categoryId)
  }

  timeoutId = setInterval(updatePlaceholder, 200)
})

onBeforeUnmount(() => {
  clearTimeout(timeoutId)
})

/**
 * 가입하기 버튼 클릭 시 호출
 */
const onSignup = () => {
  if (!isLogin()) {
    router.push('/signup/selectType')
  } else {
    proxy.$confirm(proxy.$t('CNF_LogoutSignup'), {
      title: '',
      ok: async function () {
        const result = await mainStore.onLogout()
        if (result) {
          onClickCloseMenu()
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
