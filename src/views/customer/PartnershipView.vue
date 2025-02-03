<template>
  <div class="pb144 top-nav-bar-area">
    <div class="partnership-banner-area">
      <h2>{{ $t('CS_PartnerShip') }}<br class="mo767"/> {{ $t('CS_WithRiman') }}</h2>
      <p>{{ $t('CS_PartnerSubTitle') }}</p>
    </div>

    <div class="partnership-area">
      <h2 v-clean-html="$t('CS_PartnerDesc')" class="top-title field">

      </h2>

      <div class="field">
        <h4 class="sub-title">{{ $t('CS_PartnerRequired') }}</h4>
        <p v-clean-html="$t('CS_PartnerRequiredDesc')" class="sub-text"></p>

        <div class="partnership-text-list">
          <ul>
            <li>{{ $t('CS_PartnerPhone') }}</li>
            <li>{{ $t('CS_PartnerCompanyIntro') }}</li>
          </ul>

          <ul>
            <li>{{ $t('CS_PartnerRecommSheet') }}</li>
            <li>{{ $t('CS_PartnerSaleObject') }}</li>
          </ul>
        </div>
      </div>

      <div class="field">
        <h4 class="sub-title">{{ $t('CS_PartnerServiceIntro') }}</h4>
        <table class="table type03">
          <tr>
            <th class="pre-line">{{ $t('CS_PartnerBrandRecomm') }}</th>
            <td>
              <div class="right-text-area">
                <div class="text">{{ $t('CS_PartnerProductRecomm') }}</div>
                <div class="text copy-text-area">
                  {{ $t('CM_PersonCharge') }} : ~~~@riman.com
                  <i class="ico copy" @click="copyClipboard('~~~@riman.com')" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>{{ $t('CM_Lifening') }}<br/>{{ $t('CS_PartnerRecomm') }}</th>
            <td>
              <div class="right-text-area">
                <div class="text">{{ $t('CS_PartnerProductRecomm') }}</div>
                <div class="text copy-text-area">
                  {{ $t('CM_PersonCharge') }} : ~~~@riman.com
                  <i class="ico copy" @click="copyClipboard('~~~@riman.com')" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>{{ $t('CS_PartnerProduce') }}</th>
            <td>
              <div class="right-text-area">
                <div class="text">{{ $t('CS_PartnerCosmeticRecomm') }}</div>
                <div class="text copy-text-area">
                  {{ $t('CM_PersonCharge') }} : ~~~@riman.com
                  <i class="ico copy" @click="copyClipboard('~~~@riman.com')" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>{{ $t('CS_PartnerMarketing') }}</th>
            <td>
              <div class="right-text-area">
                <div class="text">{{ $t('CS_PartnerMarketingRecomm') }}</div>
                <div class="text copy-text-area">
                  {{ $t('CM_PersonCharge') }} : ~~~@riman.com
                  <i class="ico copy" @click="copyClipboard('~~~@riman.com')" />
                </div>
              </div>
            </td>
          </tr>

        </table>
      </div>

      <div class="field">
        <h4 class="sub-title">{{ $t('CS_PartnerProcess') }}</h4>
        <ul class="partnership-program-area">
          <li class="content">
            <i class="ico registration" />
            {{ $t('CS_PartnerAdd') }}
          </li>
          <li><i class="ico arrow-right-n" /></li>
          <li class="content">
            <i class="ico receipt" />
            {{ $t('CS_PartnerReceive') }}
          </li>
          <li><i class="ico arrow-right-n" /></li>
          <li class="content">
            <i class="ico examine" />
            {{ $t('CS_PartnerCheck') }}
          </li>
          <li><i class="ico arrow-right-n" /></li>
          <li class="content">
            <i class="ico reply" />
            {{ $t('CS_PartnerReplyEmail') }}
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup>
import { copyClipboard } from '@/utils/common'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
const vCleanHtml = buildVueDompurifyHTMLDirective()
</script>

<style lang="scss" scoped>

</style>
