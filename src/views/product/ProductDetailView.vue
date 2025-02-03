<template v-if="productData">
  <div class="pb144">
    <div class="prd-detail-top-area">
      <div class="prd-detail-banner-area">
        <div v-if="fixedImage" class="fixed-prd-detail-area">
          <img :src="addPrefixForImage(fixedImage.urlImage)" alt="">
        </div>

        <!-- PC Slide -->
        <q-carousel
          v-if="imageList &&imageList.length > 0"
          v-model="slide"
          swipeable
          animated
          thumbnails
          infinite
          class="prd-pc-swiper"
        >
          <q-carousel-slide v-for="(img, index) in imageList" :key="img.fileSize" :name="index + 1" :img-src="addPrefixForImage(img.urlImage)" />
        </q-carousel>
        <!-- //PC Slide -->

        <!-- MO Slide -->
        <swiper
          v-if="imageList && imageList.length > 0"
          :modules="modules"
          :slides-per-view="'1'"
          :pagination="{
            clickable: true,
          }"
          :loop="true"
          class="prd-cart-swiper prd-mo-swiper">
          <swiper-slide v-for="img in imageList" :key="img.fileSize"><img :src="addPrefixForImage(img.urlImage)" :alt="productData?.productName"></swiper-slide>
        </swiper>
      <!-- //MO Slide -->
      </div>

      <div v-if="productData" class="prd-detail-info-content">
        <div class="prd-detail-info-area">
          <div v-if="productData?.salesStatus.code !== SALES_STATUS.sold_out" class="prd-icon-area relative left0 bottom0">
            <span v-if="productData?.applyCouponYn" class="prd-icon coupon">{{ $t('PR_ApplyCoupon') }}</span>
            <span v-if="productData?.salesStatus.code === SALES_STATUS.almost_sold_out" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
          </div>

          <span class="category-title">{{ productData?.brand.text }}</span>
          <h3 class="prd-title">{{ productData?.productName }}</h3>
          <p class="prd-detail">{{ productData?.productSummary }}</p>
          <div class="prd-price-area">
            <div class="result-prd-price">{{ $moneyFormat(productData?.priceOriginal) }}{{ $t('CM_Won') }}</div>
            <ul class="prd-point-area">
              <template v-if="isLogined && isPlanner">
                <li class="sp">
                  <span>{{ $moneyFormat(productData?.spOriginal) }}</span><span>SP</span>
                </li>
                <li class="bp">
                  <span>{{ $moneyFormat(productData?.bpOriginal) }}</span><span>BP</span>
                </li>
              </template>

              <li class="p">
                <span>{{ $moneyFormat(productData?.point) }}</span><span>P</span>
              </li>
            </ul>
          </div>
          <template v-if="productData?.optionYn">
            <template v-if="getOptionUi(productData) === 'button'">
              <div class="option-select-area">
                <div class="option-title-text">{{ productData?.option.items[0].optionName }}</div>
                <swiper
                  :slides-per-view="'auto'"
                  :free-mode="true"
                  :pagination="{
                    type: 'progressbar',
                    clickable: true,
                  }"
                  :navigation="true"
                  :modules="modules"
                  class="prd-option-swiper"
                  :class="getOptionType(productData) === 'image' ? 'h-large' : 'h-small'"
                >
                  <!-- 활성화일경우: active 클래스 추가 -->
                  <template v-if="getOptionType(productData) === 'image'">
                    <swiper-slide v-for="optionItem in options" :key="optionItem.productId" :class="generateOptionClass(optionItem)" @click="() => onClickOption(optionItem)">
                      <img :src="addPrefixForImage(optionItem.optionImageUrl)" alt="">
                      <p>{{ optionItem.label }}</p>
                      <div v-if="optionItem.salesStatus.code === SALES_STATUS.sold_out" class="sold-out-area small">
                        <div class="sold-out-bg">
                          <span class="pre-line">{{ $t('CA_SoldOut') }}</span>
                        </div>
                      </div>
                    </swiper-slide>
                  </template>
                  <template v-else>
                    <swiper-slide v-for="optionItem in options" :key="optionItem.productId" :class="generateOptionClass(optionItem)" @click="() => onClickOption(optionItem)">
                      {{ optionItem.label }}
                    </swiper-slide>
                  </template>
                </swiper>
              </div>
            </template>
            <template v-if="getOptionUi(productData) === 'select' && selectedOption" >
              <div class="option-select-box-area">
                <div class="option-title-text">{{ productData?.option.items[0].optionName }}</div>
                <RSelectBox
                  :model-value="selectedOption"
                  :options="options"
                  :filterable="false"
                  :is-opt-icon="getOptionType(productData) === 'image'"
                  class="select-box type02"
                  popup-content-class="select-list type02"
                  @update:model-value="(v) => onClickOption(v, 'select')"
                >
                  <template v-if="getOptionType(productData) === 'image'" #prepend>
                    <div class="option-img-area">
                      <img :src="addPrefixForImage(selectedOption.optionImageUrl)" :alt="selectedOption">
                    </div>
                  </template>
                </RSelectBox>
              </div>
            </template>

          </template>

          <div class="order-select-area">
            <template v-if="isAutoship">
              <div class="option-title-text">{{ $t('PR_ChooseOrderType') }}</div>

              <div class="cart-general-buy-area order-select-type">
                <div class="radio-area">
                  <q-radio v-model="pageState.cartType" dense val="normal" :label="$t('PR_AddNormalCart')"/>
                </div>

                <ul v-if="pageState.cartType === 'normal'">
                  <li>
                    <i class="ico check"></i>
                    <span>{{ $t('PR_SubsBenefit') }} </span>
                  </li>
                  <li>
                    <i class="ico check"></i>
                    <span>{{ $t('PR_SubsBenefit_txt1') }} <span class="success04-color">000{{ $t('CM_Won') }}</span>{{ $t('PR_Benefit_txt1') }}</span>
                  </li>
                  <li>
                    <i class="ico check"></i>
                    <span>{{ $t('PR_SubsBenefit_txt2') }} </span>
                  </li>
                  <li>
                    <i class="ico check"></i>
                    <span>{{ $t('PR_SubsBenefit_txt3') }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="productData?.autoShipYn" class="cart-regular-buy-area order-select-type">
                <div class="radio-area">
                  <q-radio v-model="pageState.cartType" dense val="auto" :label="$t('PR_AddSubsCart')" />
                </div>
                <ul v-if="pageState.cartType === 'auto'">
                  <li>
                    <i class="ico check"></i>
                    <span>{{ $t('PR_SubsBenefit') }} </span>
                  </li>
                  <li>
                    <i class="ico check"></i>
                    <span>{{ $t('PR_SubsBenefit_txt1') }} <span class="success04-color">000{{ $t('CM_Won') }}</span>{{ $t('PR_Benefit_txt1') }}</span>
                  </li>
                  <li>
                    <i class="ico check"></i>
                    <span>{{ $t('PR_SubsBenefit_txt2') }} </span>
                  </li>
                  <li>
                    <i class="ico check"></i>
                    <span>{{ $t('PR_SubsBenefit_txt3') }}</span>
                  </li>
                  <li>
                    <i class="ico check"></i>
                    <span>{{ $t('PR_SubsBenefit_txt4') }}  <span class="success04-color">{{ $t('PR_AddProduct') }} </span>{{ $t('PR_SubsBenefit_txt5') }}</span>
                  </li>
                </ul>
              </div>
            </template>

            <ul v-if="productData?.optionYn && selectedOptions.length > 0" class="option-select-list">
              <li v-for="item in selectedOptions" :key="item.value">
                <div class="option-title-area">
                  <span>{{ item.productName }} -- {{ item.value }}</span>
                  <i class="ico close-g" @click="onDeselectOption(item)"></i>
                </div>

                <div class="option-price-area">
                  <RNumberSpin v-model="item.quantity" :min="1" :max="!!item.maxQuantityLimit ? item.maxQuantityLimit : 100" class="num-input type01"/>
                  <div class="option-price">{{ $moneyFormat(item.priceOriginal) }}{{ $t('CM_Won') }}</div>
                </div>
              </li>
            </ul>
            <div class="price-area">
              <template v-if="productData?.optionYn">
                <span class="result-price-text">{{ $t('PR_Total') }}</span>

                <div class="">
                  <div class="result-prd-price">{{ $moneyFormat(total) }}{{ $t('CM_Won') }}</div>
                  <ul class="prd-point-area text-right">
                    <template v-if="isLogined && isPlanner">
                      <li class="sp">
                        <span>{{ $moneyFormat(spTotal) }}</span><span>SP</span>
                      </li>
                      <li class="bp">
                        <span>{{ $moneyFormat(bpTotal) }}</span><span>BP</span>
                      </li>
                    </template>

                    <li class="p">
                      <span>{{ $moneyFormat(pointTotal) }}</span><span>P</span>
                    </li>
                  </ul>
                </div>
              </template>
              <template v-else>
                <RNumberSpin v-model="pageState.quantity" :min="1" :max="!!productData?.maxQuantityLimit ? productData?.maxQuantityLimit : 100" class="num-input type01"/>
                <div class="">
                  <div class="result-prd-price">{{ $moneyFormat(productData?.priceOriginal * pageState.quantity) }}{{ $t('CM_Won') }}</div>
                  <ul class="prd-point-area text-right">
                    <template v-if="isLogined && isPlanner">
                      <li class="sp">
                        <span>{{ $moneyFormat(productData?.spOriginal * pageState.quantity) }}</span><span>SP</span>
                      </li>
                      <li class="bp">
                        <span>{{ $moneyFormat(productData?.bpOriginal * pageState.quantity) }}</span><span>BP</span>
                      </li>
                    </template>

                    <li class="p">
                      <span>{{ $moneyFormat(productData?.point * pageState.quantity) }}</span><span>P</span>
                    </li>
                  </ul>
                </div>
              </template>
            </div>

            <!-- 버튼 영역 -->
            <!-- 품절 됐을 경우 -->
            <div v-if="productData?.salesStatus.code === SALES_STATUS.sold_out" ref="floatingVisible" class="prd-detail-btn-area flex-btn-area">
              <RButton class="btn full small type03" :label="$t('PR_OtherPrd')" @on-click="modalOpen()"/>
              <RButton class="btn full small type02" :label="productData?.soldOutMessage && productData?.soldOutMessage !== '' ? productData?.soldOutMessage : $t('PR_Soldout')" disable/>
            </div>
            <!-- 품절 아닐 경우 -->
            <div v-else ref="floatingVisible" class="prd-detail-btn-area flex-btn-area">
              <RButton class="btn full small type03" label="" :disable="productData?.optionYn && selectedOptions.length === 0" @on-click="onClickBuy()">
                <template #content>
                  <i class="ico flash"></i>
                  <span>{{ $t('PR_Buy') }}</span>
                </template>
              </RButton>
              <AddCartButton v-if="productData" :product-data="productData" :page-state="pageState" :selected-options="selectedOptions" class="btn full small type02" :label="$t('CM_Cart')"/>
            </div>
            <!-- <div v-if="!isLogined" class="prd-celebration-area">
              <div class="text-area">
                <span>신규회원 첫 구매 20% 할인쿠폰</span>
                <router-link to="/login">신규 회원가입 후 할인받기</router-link>
              </div>
              <i class="ico celebration-n"></i>
            </div> -->

            <div v-if="isTablet ? isMobile ? banner?.image.mobile : banner?.image.tablet : banner?.image.pc">
              <img
                :src="addPrefixForImage(isTablet ? isMobile ? banner?.image.mobile : banner?.image.tablet : banner?.image.pc)"
                :class="[{'img-cover': true, 'with-link': banner?.link}]"
                @click="onClickBanner(banner.link)"
              />
            </div>

            <div v-if="productData?.listStyleYn" class="prd-benefits-area">
              <div class="text">{{ productData?.listStyle.title }}</div>
              <p v-clean-html="productData?.listStyle.pcContent" class="content-text">
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- content -->
    <section v-if="productData?.typographyTitle !== '' || productData?.typographyContent !== ''" class="info-text-area">
      <div v-clean-html="productData?.typographyTitle" class="title-text"></div>
      <div v-clean-html="productData?.typographyContent" class="content-text"></div>
    </section>
    <div v-else class="info-text-area-empty"></div>
    <SetProducts v-if="productData?.setYn && productData?.set.products.length > 0" :product-data="productData?.set.products"/>
    <section>
      <div class="max-width-1680 mo-p0 prd-detail-img-content">
        <q-tabs
          v-model="tabValue"
          class="tab type01 mt0"
          active-color="active"
          align="justify"
        >
          <q-tab v-if="productData?.tab1_yn" :label="productData?.titleTab1" name="tab1" />
          <q-tab v-if="productData?.tab2_yn" :label="productData?.titleTab2" name="tab2" />
          <q-tab v-if="productData?.tab3_yn" :label="productData?.titleTab3" name="tab3" />
        </q-tabs>

        <q-tab-panels v-model="tabValue" class="prd-detail-content">
          <q-tab-panel v-if="productData?.tab1_yn" name="tab1">
            <div v-clean-html="productData?.pcContentTab1"></div>
          </q-tab-panel>
          <q-tab-panel v-if="productData?.tab2_yn" name="tab2">
            <div v-clean-html="productData?.pcContentTab2"></div>
          </q-tab-panel>
          <q-tab-panel v-if="productData?.tab3_yn" name="tab3">
            <div v-clean-html="productData?.pcContentTab3"></div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </section>
    <RitualProducts v-if="productData?.ritualYn && productData?.ritual.products.length > 0" :product-data="productData?.ritual.products"/>
    <AlsoLikeProducts v-if="productData?.alsoLikeYn && productData?.alsoLike.products.length > 0" :product-data="productData?.alsoLike.products"/>

    <!-- 플로팅 버튼 -->
    <div v-touch-swipe.mouse.up="() => modalOpen()" class="prd-bottom-btn-wrap">
      <div v-if="showFixedButtons" class="prd-fixed-btn-area">
        <button class="btn mo-slide-btn"><span class="slide-icon"></span></button>
        <!-- 상품 없을 경우 -->
        <div v-if="productData?.salesStatus.code === SALES_STATUS.sold_out" class="prd-bottom-btn-area type02">
          <span class="sold-text">{{ $t('PR_RecommPrd_txt2') }} {{ $t('PR_RecommPrd_txt5') }}</span>
          <span class="mo-sold-text">{{ $t('PR_RecommPrd_txt2') }}</span>
          <div class="btn-wrap" >
            <RButton class="btn full small type03" :label="$t('PR_OtherPrd')" @on-click="modalOpen()"/>
            <RButton disabled class="btn full small type02" :label="productData?.soldOutMessage && productData?.soldOutMessage !== '' ? productData?.soldOutMessage : $t('PR_Soldout')"/>
          </div>
        </div>
        <!-- 상품이 있을 경우  -->
        <div v-else class="prd-bottom-btn-area type01">
          <RButton class="btn full small type03" label="" @on-click="onClickBuy()">
            <template #content>
              <i class="ico flash"></i>
              <span>{{ $t('PR_Buy') }}</span>
            </template>
          </RButton>
          <RButton class="btn full small type02" :label="proxy.$t('NAV_Cart')" @on-click="modalOpen()"/>
        </div>
      </div>
      <div class="prd-bottom-bg-area">
        <div class="max-width-1024">
          <!-- <span v-if="productData?.salesStatus.code === 'SOLD_OUT'" class="mo-sold-text">아쉽지만 상품이 품절이에요.</span> -->
          <!-- 플로팅 팝업 -->
          <bottom-modal v-model="dialog">
            <q-card :class="{'sold-out-card' : productData?.salesStatus.code === SALES_STATUS.sold_out}">
              <!-- 품절일 경우 -->
              <RecommendProducts v-if="productData?.salesStatus.code === SALES_STATUS.sold_out" :product-data="recommData" :sold-out-message="productData?.soldOutMessage"/>
              <!-- 옵션 -->
              <template v-else>
                <div class="prd-bottom-content max-width-1024">
                  <div class="top-content">
                    <!-- 상품옵션 없을 경우 w-full 클래스 추가 -->
                    <div class="content" :class="!productData?.optionYn && 'w-full'">
                      <div class="order-select-area">
                        <template v-if="isAutoship">
                          <div class="option-title-text">{{ $t('PR_ChooseOrderType') }}</div>

                          <div class="cart-general-buy-area order-select-type">
                            <div class="radio-area">
                              <q-radio v-model="pageState.cartType" dense val="normal" :label="$t('PR_AddNormalCart')" />
                            </div>
                            <ul v-if="pageState.cartType === 'normal'">
                              <li>
                                <i class="ico check"></i>
                                <span>{{ $t('PR_SubsBenefit') }} </span>
                              </li>
                              <li>
                                <i class="ico check"></i>
                                <span>{{ $t('PR_SubsBenefit_txt1') }} <span class="success04-color">000{{ $t('CM_Won') }}</span>{{ $t('PR_Benefit_txt1') }}</span>
                              </li>
                              <li>
                                <i class="ico check"></i>
                                <span>{{ $t('PR_SubsBenefit_txt2') }} </span>
                              </li>
                              <li>
                                <i class="ico check"></i>
                                <span>{{ $t('PR_SubsBenefit_txt3') }}</span>
                              </li>
                              <li>
                                <i class="ico check"></i>
                                <span>{{ $t('PR_SubsBenefit_txt4') }}  <span class="success04-color">{{ $t('PR_AddProduct') }}</span>{{ $t('PR_SubsBenefit_txt5') }}</span>
                              </li>
                            </ul>
                          </div>
                          <div v-if="productData?.autoShipYn" class="cart-regular-buy-area order-select-type">
                            <div class="radio-area">
                              <q-radio v-model="pageState.cartType" dense val="auto" :label="$t('PR_AddSubsCart')"/>
                            </div>
                            <ul v-if="pageState.cartType === 'auto'">
                              <li>
                                <i class="ico check"></i>
                                <span>{{ $t('PR_SubsBenefit') }} </span>
                              </li>
                              <li>
                                <i class="ico check"></i>
                                <span>{{ $t('PR_SubsBenefit_txt1') }} <span class="success04-color">000{{ $t('CM_Won') }}</span>{{ $t('PR_Benefit_txt1') }}</span>
                              </li>
                              <li>
                                <i class="ico check"></i>
                                <span>{{ $t('PR_SubsBenefit_txt2') }} </span>
                              </li>
                              <li>
                                <i class="ico check"></i>
                                <span>{{ $t('PR_SubsBenefit_txt3') }}</span>
                              </li>
                              <li>
                                <i class="ico check"></i>
                                <span>{{ $t('PR_SubsBenefit_txt4') }}  <span class="success04-color">{{ $t('PR_AddProduct') }}</span>{{ $t('PR_SubsBenefit_txt5') }}</span>
                              </li>
                              <li>
                                <router-link to="/autoship">{{ $t('PR_AddSubs') }}</router-link>
                              </li>
                            </ul>
                          </div>
                        </template>
                      </div>
                      <!-- 옵션 있을 경우 -->
                      <div v-if="productData?.optionYn && productData?.option && options" class="option-select-box-area mt0 mb16">
                        <template v-if="getOptionUi(productData) === 'select'">
                          <div class="option-title-text">옵션선택</div>
                          <RSelectBox
                            :model-value="selectedOption"
                            :options="options"
                            :filterable="false"
                            :is-opt-icon="productData?.option.items[0].optionImageUrl !== ''"
                            class="select-box type02"
                            popup-content-class="select-list type02"
                            @update:model-value="(v) => onClickOption(v, 'select')"
                          >
                            <template v-if="getOptionType(productData) === 'image'" #prepend>
                              <div class="option-img-area">
                                <img :src="addPrefixForImage(selectedOption.optionImageUrl)" alt="">
                              </div>
                            </template>
                          </RSelectBox>
                        </template>
                        <template v-if="getOptionUi(productData) === 'button'">
                          <div class="option-title-text">{{ productData?.option.items[0].optionName }}</div>
                          <swiper
                            :slides-per-view="'auto'"
                            :free-mode="true"
                            :pagination="{
                              type: 'progressbar',
                              clickable: true,
                            }"
                            :navigation="true"
                            :modules="modules"
                            class="prd-option-swiper"
                            :class="getOptionType(productData) === 'image' ? 'h-large' : 'h-small'"
                          >
                            <!-- 활성화일경우: active 클래스 추가 -->
                            <template v-if="getOptionType(productData) === 'image'">
                              <swiper-slide v-for="optionItem in options" :key="optionItem.productId" :class="generateOptionClass(optionItem)" @click="() => onClickOption(optionItem)">
                                <img :src="addPrefixForImage(optionItem.optionImageUrl)" alt="">
                                <p>{{ optionItem.label }}</p>
                                <div v-if="optionItem.salesStatus.code === SALES_STATUS.sold_out" class="sold-out-area small">
                                  <div class="sold-out-bg">
                                    <span class="pre-line">{{ $t('CA_SoldOut') }}</span>
                                  </div>
                                </div>
                              </swiper-slide>
                            </template>
                            <template v-else>
                              <swiper-slide v-for="optionItem in options" :key="optionItem.productId" :class="generateOptionClass(optionItem)" @click="() => onClickOption(optionItem)">
                                {{ optionItem.label }}
                              </swiper-slide>
                            </template>
                          </swiper>
                        </template>
                      </div>
                      <!-- //옵션 있을 경우 -->
                    </div>
                    <div v-if="productData?.optionYn && selectedOptions.length > 0" class="content">
                      <div class="option-title-text">{{ $t('PR_SelectedPrd') }}</div>
                      <ul class="option-select-list">
                        <li v-for="item in selectedOptions" :key="item.value">
                          <div class="option-title-area">
                            <span>{{ item.productName }} -- {{ item.value }}</span>
                            <i class="ico close-g" @click="onDeselectOption(item)"></i>
                          </div>
                          <div class="option-price-area">
                            <RNumberSpin v-model="item.quantity" :min="1" :max="!!item.maxQuantityLimit ? item.maxQuantityLimit : 100" class="num-input type01"/>
                            <div class="option-price">{{ $moneyFormat(item.priceOriginal) }}{{ $t('CM_Won') }}</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!-- 총합계 -->
                  <div class="price-area" :class="{ 'option-none' : !productData?.optionYn }">
                    <template v-if="productData?.optionYn">
                      <span class="result-price-text">{{ $t('PR_Total') }}</span>
                      <div class="">
                        <div class="result-prd-price">{{ $moneyFormat(total) }}{{ $t('CM_Won') }}</div>
                        <ul class="prd-point-area">
                          <template v-if="isLogined && isPlanner">
                            <li class="sp">
                              <span>{{ $moneyFormat(spTotal) }}</span><span>SP</span>
                            </li>
                            <li class="bp">
                              <span>{{ $moneyFormat(bpTotal) }}</span><span>BP</span>
                            </li>
                          </template>
                          <li class="p">
                            <span>{{ $moneyFormat(pointTotal) }}</span><span>P</span>
                          </li>
                        </ul>
                      </div>
                    </template>
                    <template v-else>
                      <RNumberSpin v-model="pageState.quantity" :min="1" :max="!!productData?.maxQuantityLimit ? productData?.maxQuantityLimit : 100" class="num-input type01"/>
                      <div class="">
                        <div class="result-prd-price">{{ $moneyFormat(productData?.priceOriginal * pageState.quantity) }}{{ $t('CM_Won') }}</div>
                        <ul class="prd-point-area">
                          <template v-if="isLogined && isPlanner">
                            <li class="sp">
                              <span>{{ $moneyFormat(productData?.spOriginal * pageState.quantity) }}</span><span>SP</span>
                            </li>
                            <li class="bp">
                              <span>{{ $moneyFormat(productData?.bpOriginal * pageState.quantity) }}</span><span>BP</span>
                            </li>
                          </template>
                          <li class="p">
                            <span>{{ $moneyFormat(productData?.point * pageState.quantity) }}</span><span>P</span>
                          </li>
                        </ul>
                      </div>
                    </template>
                  </div>
                  <!-- 상품이 있을 경우  -->
                  <div class="prd-bottom-btn-area type01">
                    <RButton class="btn full small type03" label="" :disable="productData?.optionYn && selectedOptions.length === 0" @on-click="onClickBuy()">
                      <template #content>
                        <i class="ico flash"></i>
                        <span>{{ $t('PR_Buy') }}</span>
                      </template>
                    </RButton>
                    <AddCartButton v-if="productData" :product-data="productData" :page-state="pageState" :selected-options="selectedOptions" class="btn full small type02" :label="$t('CM_Cart')"/>
                  </div>
                </div>
              </template>
            </q-card>
          </bottom-modal>
          <!-- //플로팅 팝업 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance, watch, computed, reactive } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { isLogin } from '@/utils/login'
import productService from '@/http/services/product'
import { useRoute, useRouter } from 'vue-router'
import { addPrefixForImage, checkPlanner, generateOptionObj, getOptionType, getOptionUi } from '@/utils/common'
import RNumberSpin from '@/components/common/RNumberSpin'
import { ORDER_DATA, ORDER_PREPATH, sessionDataManager } from '@/utils/dataManager'
import AddCartButton from './AddCartButton'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { SALES_STATUS } from '@/utils/constant'
import AlsoLikeProducts from './components/AlsoLikeProducts'
import RitualProducts from './components/RitualProducts'
import RecommendProducts from './components/RecommendProducts'
import SetProducts from './components/SetProducts'
import cartService from '@/http/services/cart'
import { useMainStore } from '@/store/mainStore'
import orderService from '@/http/services/order'
import memberService from '@/http/services/member'
import etcService from '@/http/services/etc'

const vCleanHtml = buildVueDompurifyHTMLDirective()
const route = useRoute()
const router = useRouter()
const productId = route.params.productId
const { proxy } = getCurrentInstance()
const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const slide = ref(1)
const selectedOption = ref(null)
const tabValue = ref(null)
const selectedOptions = ref([])
const options = ref([])
const isAutoship = import.meta.env.VITE_APP_IS_AUTOSHIP === 'true'
const dialog = ref(false)
const mainStore = useMainStore()
const position = ref('botom')
const floatingVisible = ref(null)
const showFixedButtons = ref(false)

const modalOpen = () => {
  dialog.value = true
  position.value = 'bottom'
}
const isPlanner = computed(() => checkPlanner())
const isMobile = computed(() => proxy.$isMobile())
const isTablet = computed(() => proxy.$isTablet())
const pageState = reactive({
  quantity: 1,
  cartType: 'normal'
})
const isLogined = computed(() => isLogin())
const total = computed(() => {
  return selectedOptions.value.reduce((pre, cur) => {
    pre = pre + cur.priceOriginal * cur.quantity
    return pre
  }, 0)
})
const spTotal = computed(() => {
  return selectedOptions.value.reduce((pre, cur) => {
    pre = pre + cur.spOriginal * cur.quantity
    return pre
  }, 0)
})
const bpTotal = computed(() => {
  return selectedOptions.value.reduce((pre, cur) => {
    pre = pre + cur.bpOriginal * cur.quantity
    return pre
  }, 0)
})
const pointTotal = computed(() => {
  return selectedOptions.value.reduce((pre, cur) => {
    pre = pre + cur.point * cur.quantity
    return pre
  }, 0)
})
const userId = mainStore.getUser.userSeqNo
const params = reactive({
  categoryIds: computed(() => (productData.value && productData.value.salesStatus.code === SALES_STATUS.sold_out && productData.value.categories) ?? null),
  excludeProductType: null,
  soldOutSelect: false
})

const { data: productData, isError: productError } = productService.getProductDetail(productId.toString(), userId)
const { data: recommData } = productService.getRecommendProductList(params)

const fixedImage = computed(() => productData.value && productData.value.imageUrl.filter(item => item.imageType.code === 'THUMBNAIL')[0])
const imageList = computed(() => productData.value && productData.value.imageUrl.filter(item => item.imageType.code !== 'THUMBNAIL'))
const banner = ref(undefined)
const onClickBuy = async () => {
  const res = await checkProductStatus()
  if (!res) return
  if (isLogined.value) {
    const canbuy = await checkUserStatus()
    if (!canbuy) {
      proxy.$alert(proxy.$t('PR_JudgementInfo'))
      return
    }
  }
  const buyList = generateParams(productData?.value)
  if (productData?.value.optionYn && selectedOptions.value.length <= 0) {
    modalOpen()
  } else {
    const isLimitProduct = checkIsLimitProduct()
    if (isLimitProduct) {
      if (!isLogined.value) {
        proxy.$confirm('', {
          title: proxy.$t('PR_MaxQuantityLimit'),
          okLabel: proxy.$t('USR_GoLogin'),
          ok: () => router.push({
            name: 'Login',
            query: { redirect: route.fullPath }
          })
        })
        return
      }
    }
    doBuy(buyList, isLimitProduct)
  }
}
const onClickOption = (optionItem, optionType) => {
  let _optionItem = optionItem
  if (optionType === 'select') {
    _optionItem = options.value.filter(item => item.value === optionItem)[0]
  }
  if (_optionItem.salesStatus.code === SALES_STATUS.sold_out) return
  if (!checkIsSelected(_optionItem)) {
    selectedOptions.value.push(_optionItem)
  }
  selectedOption.value = _optionItem
}
function onDeselectOption(option) {
  if (getOptionUi(productData.value) === 'select') {
    const onSaleProductQuantity = checkOnSaleProductQuantity()
    if (onSaleProductQuantity <= 1) {
      return
    }
  }
  selectedOptions.value = selectedOptions.value.filter(item => item.value !== option.value)
}

async function doBuy(buyList, isLimitProduct) {
  sessionDataManager.set(ORDER_DATA, JSON.stringify(buyList))
  sessionDataManager.set(ORDER_PREPATH, route.fullPath)
  if (!isLogined.value) {
    proxy.$confirm(proxy.$t('CA_BuyNoAuth_txt1'), {
      title: proxy.$t('CA_BuyNoAuth_txt2'),
      okLabel: proxy.$t('CA_BuyNoAuth'),
      cancelLabel: proxy.$t('USR_GoLogin'),
      ok: () => router.push('/order/nonuser/info'),
      cancel: () => {
        router.push({
          path: '/login',
          query: { redirect: route.fullPath }
        })
      }
    })
  } else {
    let canBuy = false
    if (isLimitProduct) {
      const res = await checkMaxQuantity(buyList)
      if (res) {
        if (!res.data) {
          canBuy = true
        }
      }
    } else {
      canBuy = true
    }
    if (canBuy) {
      router.push('/order')
    }
  }
}
function checkMaxQuantity(buyList) {
  const param = {
    userId: userId,
    productInfo: buyList.map(item => ({
      productId: item.productOptionId ? item.productOptionId : item.productId,
      productQuantity: item.quantity
    }))
  }
  return cartService.postCheckMaxQuantity(param)
}

function generateOptionClass(optionItem) {
  let className = ''
  if (selectedOption.value) {
    if (selectedOption.value.productId === optionItem.productId) {
      className = 'active'
    }
  }
  if (optionItem.salesStatus.code === SALES_STATUS.sold_out) {
    className = 'disabled'
  }
  return className
}
function checkProductStatus() {
  let productInfo = null
  if (selectedOptions.value.length > 0) {
    productInfo = selectedOptions.value.map(item => {
      return {
        productId: productData.value.productId,
        productOptionId: item.productId
      }
    })
  } else {
    productInfo = [{
      productId: productData.value.productId,
      productOptionId: null
    }]
  }
  const params = {
    productInfo
  }
  return orderService.getProductStatus(params)
}
function checkIsLimitProduct() {
  if (productData.value.optionYn) {
    return selectedOptions.value.some(item => {
      return !!item.maxQuantityLimit
    })
  } else {
    return !!productData.value.maxQuantityLimit
  }
}
function generateParams(productData) {
  let params = null
  if (productData.optionYn) {
    params = selectedOptions.value.map(item => {
      const obj = {
        productId: productData.productId,
        productOptionId: item.productId,
        quantity: item.quantity
      }
      return obj
    })
  } else {
    params = [{
      productId: productData.productId,
      quantity: pageState.quantity
    }]
  }
  return params
}
function checkOnSaleProductQuantity() {
  return options.value.filter(item => item.salesStatus.code !== SALES_STATUS.sold_out).length
}
function checkIsSelected(optionItem) {
  return selectedOptions.value.map(item => {
    return item.productId
  }).includes(optionItem.productId)
}
function initOptions(data) {
  if (!data.option || !data.optionYn) return
  data.option.items.forEach(item => {
    item = generateOptionObj(item, productData.value.priceOriginal)
    item.quantity = 1
    options.value.push(item)
  })
  let selected = data.option.selectedOption
  if (getOptionUi(data) === 'select') {
    if (data.option.items.every(item => item.salesStatus.code === SALES_STATUS.sold_out)) {
      selected = options.value[0]
    } else {
      selected = data.option.selectedOption ?? options.value.filter(item => item.salesStatus.code !== SALES_STATUS.sold_out)[0]
    }
  }
  if (selected) {
    selectedOption.value = selected
    if (selected.salesStatus.code !== SALES_STATUS.sold_out) {
      selectedOptions.value.push(selected)
    }
  }
}
function setDefaultTab() {
  if (productData.value.tab1_yn) {
    tabValue.value = 'tab1'
  } else if (productData.value.tab2_yn) {
    tabValue.value = 'tab2'
  } else if (productData.value.tab3_yn) {
    tabValue.value = 'tab3'
  }
}
function handleScroll() {
  if (floatingVisible.value) {
    const rect = floatingVisible.value.getBoundingClientRect()
    showFixedButtons.value = rect.top <= 0
  }
}
async function checkUserStatus() {
  let canBuy = true
  const res = await memberService.getUserStatus(userId)
  if (res && res.data) {
    if (res.data.judgementHistories && res.data.judgementHistories.length > 0) {
      canBuy = false
    }
  }
  return canBuy
}

const getBanner = async () => {
  const param = {
    location: 'PRODUCT_DETAIL'
  }
  const result = await etcService.getBanner(param)

  if (result) {
    banner.value = result.data
  }
}

const onClickBanner = (link) => {
  if (!link) return
  router.push(link)
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  getBanner()

  if (productData.value) {
    const v = productData.value
    if (v.autoShipYn) {
      pageState.cartType = 'auto'
    } else {
      pageState.cartType = 'normal'
    }
    initOptions(v)
    setDefaultTab()
  }
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
watch(productData, v => {
  if (v) {
    if (isAutoship && v.autoShipYn) {
      pageState.cartType = 'auto'
    } else {
      pageState.cartType = 'normal'
    }
    initOptions(v)
    setDefaultTab()
  }
})
watch(productError, v => {
  if (v) {
    proxy.$alert(proxy.$t('PR_StopSelling'), {
      ok: () => {
        router.go(-1)
      }
    })
  }
})
</script>
<style lang="scss" scoped>
.with-link {
  cursor: pointer;
}
</style>
