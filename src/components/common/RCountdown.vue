<!--
카운트다운
create by jhchoi
-->
<template>
  <span ref="_countDown" class="count-down-text">
    {{ formatTime(remainTime) }}
  </span>
</template>

<script setup>
import { defineProps, defineModel, ref, onMounted, watch } from 'vue'
const emit = defineEmits(['end'])
const props = defineProps({
  time: {
    type: Number,
    default: 300 // 5분
  }
})
const remainTime = ref(props.time - 1)

const intervalId = ref('')

const startTimer = () => {
  if (intervalId.value) return

  intervalId.value = setInterval(() => {
    if (remainTime.value > 1) {
      remainTime.value--
    } else {
      stopTimer()
      emit('end')
    }
  }, 1000)
}

const stopTimer = () => {
  clearInterval(intervalId.value)
  intervalId.value = null
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

onMounted(() => {
  startTimer()
})

const resetTime = () => {
  remainTime.value = props.time
  stopTimer()
  startTimer()
}
defineExpose({
  resetTime
})
</script>
