<template>
  <div class="about-wrap">

    <section class="about-section about-banner-section max-width-1680">
      <div class="about-top-banner-area">
        <h1 class="title bold">RIMAN의 발자취</h1>
        <p class="sub-text">창립 이래 이어온 가치와 성장을 통해 미래를 향한 발걸음을 함께합니다.</p>

        <div class="history-video-bg video-bg">
          <video class="video-content" autoplay muted loop playsinline>
            <source src="@assets/video/history_banner_bg.mp4" type="video/mp4" />
          </video>
        </div>

      </div>

      <Breadcrumb />
    </section>

    <section ref="historyTextSection" class="about-section title-sub-text-section">
      <div class="text-area">
        <h1 data-aos="fade-up" data-aos-duration="1000" class="title">변화를 꿈꾸며 시작된 <br class="mo"/>리만의 여정</h1>
        <p data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600" class="sub-text">
          The Legacy of RIMAN<br/>
          사람과 가치를 기반으로 한 리만의 여정은 비전을 실현하며<br/>
          K-뷰티의 중심에서 세계로 비상하고 있습니다.
        </p>
      </div>
    </section>

    <section ref="historyListSection" class="about-section history-list-section">
      <div ref="historyLine" class="history-line" :style="{ height: lineHeight + 'px' }"></div>
      <ul class="history-list">
        <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="700">
          <div class="img-area type01">
            <img src="@assets/images/about/history_img_01.png" alt="" class="top-img">
            <img src="@assets/images/about/history_img_02.png" alt="" class="bottom-img">
          </div>
          <div class="text-area">
            <span class="chapter-text">Chapter 01</span>
            <h3 class="title-text">소망을 담은 <b>마지막 창업</b></h3>
            <p class="contnet-text">
              RIMAN은 안중현 회장이 창업한 첫 회사가<br/>
              아닌, 마지막 회사입니다. 청년 시절부터 30여년 간 직접판매를 비롯한 다양한 영역에서 많은 브랜드를 성공시켜온 경험을 RIMAN은 그 끝에 알게 된 것들을 온전히 담아 시대적 소명 아래 명확한 비전으로 창립된 기업입니다.
            </p>
          </div>
        </li>

        <li data-aos="fade-up" data-aos-duration="1000" class="row-reverse">
          <div class="img-area type02">
            <img src="@assets/images/about/history_img_03.png" alt="" class="top-img">
          </div>
          <div class="text-area">
            <span class="chapter-text">Chapter 02</span>
            <h3 class="title-text"><b>RIMAN : 다시, 사람</b></h3>
            <p class="contnet-text">
              RIMAN 창업이념의 중심은 [사람]입니다.<br/>
              기술 발전 속에서도 사람의 가치를 되찾고<br/>
              사람과 사람의 연결과 가능성을 소중히 여기며<br/>
              이를 바탕으로 RIMAN의 모든 것은 [다시, 사람]이 성공하는<br/>
              비즈니스를 위해 설립되었습니다.
            </p>
          </div>
        </li>

        <li data-aos="fade-up" data-aos-duration="1000" class="">
          <div class="img-area type02">
            <img src="@assets/images/about/history_img_04.png" alt="" class="top-img">
          </div>
          <div class="text-area">
            <span class="chapter-text">Chapter 03</span>
            <h3 class="title-text"><b>사람이 성공하는 비즈니스</b></h3>
            <p class="contnet-text">
              RIMAN에게 중요한 것은 함께하는 사람들의 성공입니다. <br/>
              회원들이 지속 가능한 성장을 이루고 자유롭고 충족된 삶을 누리도록 돕는 것이 기업의 성장 전략입니다.
              <br/><br/>
              사람 간의 연결로 존중과 친애의 커뮤니티를 구축하여 강력한 유통과 마케팅의 역할을 합니다.
              <br/><br/>
              RIMAN은 회원들이 자랑스러워하는 제품을 통해 사람들의 삶을 건강하고 아름답게 빛내는 가치를 제공합니다. 혁신적이고 엄격하게 만들어진 제품은 리만의 성공을 뒷받침하는 토대입니다.
            </p>
          </div>
        </li>

        <li data-aos="fade-up" data-aos-duration="1000" class="row-reverse">
          <div class="img-area type03">
            <img src="@assets/images/about/history_img_05.png" alt="" class="top-img">
            <img src="@assets/images/about/history_img_06.png" alt="" class="bottom-img">
          </div>

          <div class="text-area">
            <span class="chapter-text">Chapter 04</span>
            <h3 class="title-text"><b>사람의 삶이 빛나는 가치</b></h3>
            <p class="contnet-text">
              RIMAN이 사람들의 성공을 위해 가장 잘할 수 있는 일은 회원들이 자랑스러워할 제품을 만드는 것입니다. 사람들의 삶을 더 건강하고 아름답게 빛내고, 자연스럽게 모일 수 있는 제품을 제공하는 것이 기업의 목표이며 이러한 가치를 제공하는 것이 기업의 성공 토대입니다.
              그러므로 RIMAN의 제품은 혁신적이고 엄격한 기준을 바탕으로 만들어지며, 독보적인 효능을 위한 기술 발전을 멈추지 않을 것입니다.
            </p>
          </div>
        </li>
      </ul>
    </section>

    <section class="about-section history-map-section">

      <div class="title-area">
        <span class="chapter-text">Chapter 05</span>
        <h1 data-aos="fade-up" data-aos-duration="1000">세계로 뻗어 나가는 빛</h1>
        <p data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
          RIMAN의 또 다른 소명은 대한민국에서 탄생한 글로벌 브랜드를 만드는 것입니다.<br class="pc-1023"/>
          이를 위해 세계적 수준의 제품, 브랜드, 그리고 비즈니스 플랫폼을 처음부터 구축해왔습니다.
          RIMAN은 함께하는 사람들의 신뢰와 사랑을 바탕으로 계속 세계로 도약합니다.
        </p>
      </div>

      <div class="max-width-1400">
        <ul class="tab type05 large mo-mlr-0">
          <li v-for="category in mapCategory" :key="category" :class="{'active' : selectedCategory === category.category}" @click="selectCategory(category.category)">{{ category.name }}</li>
        </ul>

        <div v-if="selectedCategory === 'all'" class="map-arae scroll type01">
          <div class="map-scroll-innnr">
            <img src="@assets/images/about/history_map.png" alt="" class="img-cover">

            <div class="map-card canada" @click="selectedCategory = 'canada'">
              캐나다
              <i class="ico map" />
            </div>

            <div class="map-card usa" @click="selectedCategory = 'america'">
              미국
              <i class="ico map" />
            </div>

            <div class="map-card korea" @click="selectedCategory = 'korea'">
              대한민국
              <i class="ico map" />
            </div>

            <div class="map-card taiwan" @click="selectedCategory = 'taiwan'">
              대만
              <i class="ico map" />
            </div>

            <div class="map-card hongkong" @click="selectedCategory = 'hongkong'">
              홍콩
              <i class="ico map" />
            </div>
          </div>

        </div>

        <ul v-else class="history-map-list">
          <li v-for="data in filteredMapData" :key="data.title">
            <img :src="data.imgUrl" alt="{{ data.title }}">
            <div class="text-area">
              <h3>{{ data.title }}</h3>
              <p>{{ data.content }}</p>
              <dl class="history-map-dl" v-html="data.tag">
              </dl>
            </div>
          </li>
        </ul>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import rimanKorea from '@/assets/images/about/riman_korea.png'
import rimanVillage from '@/assets/images/about/riman_village.png'
import rimanNorthAmerica from '@/assets/images/about/riman_north_america.png'
import rimanTaiwan from '@/assets/images/about/riman_taiwan.png'
import rimanHongkong from '@/assets/images/about/riman_hongkong.png'
import Breadcrumb from '../Breadcrumb.vue'

const historyListSection = ref(null)
const historyLine = ref(null)
const lineHeight = ref(0)

const updateScrollPosition = () => {
  const winScroll = window.scrollY + window.innerHeight
  const historyInnerTop = historyListSection.value.offsetTop
  const historyInnerHeight = historyListSection.value.clientHeight

  if (winScroll >= historyInnerTop + 150) {
    lineHeight.value = winScroll - (historyInnerTop + 143)

    if (lineHeight.value < 0) {
      lineHeight.value = 0
    } else if (lineHeight.value >= historyInnerHeight) {
      lineHeight.value = historyInnerHeight
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollPosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollPosition)
})

const mapCategory = [
  { category: 'all', name: '전체' },
  { category: 'korea', name: '대한민국' },
  { category: 'america', name: '미국' },
  { category: 'canada', name: '캐나다' },
  { category: 'taiwan', name: '대만' },
  { category: 'hongkong', name: '홍콩' }
]

const selectedCategory = ref('all')

const selectCategory = (category) => {
  selectedCategory.value = category
  console.log(selectedCategory.value)
}

const mapData = [
  {
    category: 'korea',
    imgUrl: rimanKorea,
    title: 'Korea (Global HQ)',
    content: 'RIMAN(리만)은 한국의 프리미엄 화장품 브랜드로, 자연 유래 성분과 특허 기술을 바탕으로 인셀덤(Incellderm) 등 스킨케어를 중심으로 한 혁신적인 제품군을 제공합니다. 첨단 과학을 결합해 K-뷰티의 새로운 기준을 제시하며 소비자들에게 차별화된 품질과 고급스러운 경험을 제공합니다. 빠르게 성장하며 글로벌 직접판매기업 순위(Global DSN 100)에서 23위를 기록했으며, 미국과 캐나다 등 글로벌 시장에 성공적으로 진출하고 있습니다.',
    tag: `<dt>법인 사이트</dt>
          <dd>
            <a href="www.rimankorea.com" target="_blank">www.rimankorea.com</a>
            <a href="https://kr.riman.com/" target="_blank">https://kr.riman.com/</a>
          </dd>
          <dt>본사 주소</dt>
          <dd>대구 수성구 동대구로 86</dd>
          <dt>서울사무소</dt>
          <dd>서울 강남구 테헤란로 509 엔씨타워 I</dd>
          <dt>연락처</dt>
          <dd>1588-8144</dd>`
  },
  {
    category: 'korea',
    imgUrl: rimanVillage,
    title: 'RIMAN Village',
    content: '',
    tag: `<dt>주소</dt>
          <dd>제주 서귀포시 남원읍 태위로2번길 9</dd>`
  },
  {
    category: 'america',
    imgUrl: rimanNorthAmerica,
    title: 'RIMAN North America',
    content: '',
    tag: `<dt>법인 사이트</dt>
          <dd>
            <a href="https://riman.com/" target="_blank">https://riman.com/</a>
          </dd>
          <dt>주소</dt>
          <dd>108 Pacifica Irvine, CA 92618</dd>
          <dt>연락처</dt>
          <dd>+1 (949) 541-9431</dd>`
  },
  {
    category: 'canada',
    imgUrl: rimanNorthAmerica,
    title: 'RIMAN North America',
    content: '',
    tag: `<dt>법인 사이트</dt>
          <dd>
            <a href="https://riman.com/" target="_blank">https://riman.com/</a>
          </dd>
          <dt>주소</dt>
          <dd>108 Pacifica Irvine, CA 92618</dd>
          <dt>연락처</dt>
          <dd>+1 (949) 541-9431</dd>`
  },
  {
    category: 'taiwan',
    imgUrl: rimanTaiwan,
    title: 'RIMAN Taiwan',
    content: '',
    tag: `<dt>법인 사이트</dt>
          <dd>
            <a href="https://mall.riman.tw/" target="_blank">https://mall.riman.tw/</a>
          </dd>
          <dt>주소</dt>
          <dd>10F., No. 563, Sec. 4, Zhongxiao E. Rd., Xinyi Dist., Taipei City 110058 , Taiwan</dd>
          <dt>브랜치 주소</dt>
          <dd>Rm. B, 22F., No. 6, Siwei 3rd Rd., Lingya Dist., Kaohsiung City 802701 , Taiwan</dd>
          <dt>연락처</dt>
          <dd>
            <span>02-2762-2588</span>
            <span>cs.tw@riman.com</span>
          </dd>`
  },
  {
    category: 'hongkong',
    imgUrl: rimanHongkong,
    title: 'RIMAN Hong Kong',
    content: '',
    tag: `<dt>법인 사이트</dt>
          <dd>
            <a href="https://riman.com.hk/" target="_blank">https://riman.com.hk/</a>
          </dd>
          <dt>연락처</dt>
          <dd>cs.hk@riman.com</dd>`
  }

]

const filteredMapData = computed(() => {
  return mapData.filter(data => data.category === selectedCategory.value)
})
</script>

<style lang="scss" scoped>

</style>
