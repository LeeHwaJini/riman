<!--
  container
  create by chjm (2023-05-30)
-->
<template>
  <main class="view">
    <router-view :key="$route.fullPath" />
  </main>
</template>
