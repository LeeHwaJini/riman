<!--
  메인 팝업
  create by jhYoon
-->
<template>
  <q-dialog
    ref="modal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    class="today-only-modal main-popup-modal"
  >
    <layout-modal ref="layoutModal">
      <!-- 팝업 내용 -->
      <template #body>
        <div class="main-popup-wrap">
          <div class="main-popup-top-area">
            <div class="pagination-area"></div>
            <button
              v-if="popupList.length > 1"
              class="btn"
              @click="toggleAutoplay"
            >
              <i class="ico" :class="isPlaying ? 'pause-w' : 'play-w'"></i>
            </button>
          </div>

          <swiper
            :modules="modules"
            :slides-per-view="'1'"
            :navigation="true"
            :pagination="{
              el: '.pagination-area',
              type: 'fraction',
              clickable: true,
              renderFraction: (currentClass, totalClass) => {
                return `<div class='pagenation type02'><span class='${currentClass}'></span><span class='${totalClass}'</span></div>`;
              },
            }"
            :loop="true"
            :autoplay="{
              delay: 5000,
              disableOnInteraction: false,
            }"
            class="main-notic-popup-swiper"
            @swiper="onSwiper"
          >
            <swiper-slide
              v-for="(item, index) in popupList"
              :key="index"
              :class="[
                item.linkUrl ? 'pointer' : '',
                item?.popupContentType?.code === 'CONTENT' ? 'text-slide' : '',
                item.linkUrl && item?.popupContentType?.code === 'CONTENT'
                  ? 'pointer text-slide'
                  : '',
              ]"
              @click="item.linkUrl ? navigateToUrl(item.linkUrl) : null"
            >
              <div v-if="item?.popupContentType?.code === 'CONTENT'">
                <div class="main-popupo-title">RIMAN UPDATE</div>
                <div class="popup-container scroll-type">
                  <b class="title-text">
                    {{ item.popup_title }}
                    {{ item?.popupContentType?.code }}
                  </b>
                  <!-- <p class="content-text scroll type01">
                    {{ item.popup_written_contents }}
                  </p> -->
                  <p
                    class="content-text scroll type01"
                    v-html="item.popup_written_contents"
                  ></p>
                </div>
              </div>
              <img
                v-else
                :src="addPrefixForImage(item?.attachmentImageUrl)"
                alt=""
                class="img-cover"
              />
            </swiper-slide>
          </swiper>
        </div>
      </template>

      <template #bottom>
        <div class="modal-content-header">
          <RCheckbox v-model="checked">
            <span>{{ $t("CMM_NonViewToday") }}</span>
          </RCheckbox>
          <RButton icon="close" class="bg_lightGray col-2" @click="hide" />
        </div>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { reactive } from "vue";
import { ref, computed, defineProps, onMounted, getCurrentInstance } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import {
  Pagination,
  Autoplay,
  FreeMode,
  Scrollbar,
  Navigation,
} from "swiper/modules";
import { addPrefixForImage } from "@/utils/common";
import { cookieDataManager } from "@utils/dataManager";

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation];

const props = defineProps({
  listValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["ok", "cancel"]);
const { proxy } = getCurrentInstance();
const modal = ref();
const isMobile = computed(() => proxy.$isTablet());
const popupList = props.listValue;

const isPlaying = ref(true);
const swiperEl = ref(null);

const onSwiper = (swiper) => {
  swiperEl.value = swiper;
};

const toggleAutoplay = () => {
  isPlaying.value = !isPlaying.value;

  if (isPlaying.value) {
    swiperEl.value.autoplay.start();
  } else {
    swiperEl.value.autoplay.stop();
  }
};

// 팝업 Hide 호출
const hide = () => {
  if (checked.value) {
    cookieDataManager.set("_eventpopclose", true, "1d");
  }
  modal.value.hide();
};

const show = () => {
  modal.value.show();
};

const checked = ref(false);

const navigateToUrl = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};

onMounted(() => {
  window.addEventListener("closeModal", hide);
});

defineExpose({
  show,
  hide,
});
</script>
