<!--
  마이페이지 > 플래너 서류확인
  create by jhchoi
-->
<template>
  <div class="max-width-wrap signup-wrap pb144">
    <div class="signup-detail-title-area">
      <h4 class="animate__fadeInUp"><b>{{ $t('SIG_MemberDocument') }}<br/>{{ $t('CPD_Title') }}</b></h4>
      <p class="animate__fadeInUp animate__delay-2s gray07-color">{{ $t('CPD_SubTitle1') }}<br>{{ $t('CPD_SubTitle2') }}</p>
    </div>

    <ul class="planner-check-list">
      <li>
        <h6>{{ $t('CPD_MemberBook') }}</h6>
        <p>{{ $t('CPD_MemberBookDesc') }}</p>

        <RButton class="btn type02 small planner-note-down-btn" @on-click="downloadBook" >
          <template #content>
            <i class="ico download-w" />
            <b>{{ $t('CPD_DownloadMemberBook') }}</b>
          </template>
        </RButton>
      </li>

      <li>
        <h6>{{ $t('CPD_MemberCerti') }}</h6>
        <p>{{ $t('CPD_MemberCertiDesc') }}</p>

        <RButton class="btn type02 small planner-note-down-btn" @on-click="downloadCertificate" >
          <template #content>
            <i class="ico download-w" />
            <b>{{ $t('CPD_DownloadMemberCerti') }}</b>
          </template>
        </RButton>
      </li>
    </ul>

  </div>
</template>

<script setup>
import mypageService from '@/http/services/mypage'

const downloadCertificate = () => {
  mypageService.getPlannerCertificate()
}

const downloadBook = () => {
  mypageService.getPlannerBook()
}
</script>
