<template>
  <div class="tag-input">
    <div class="content">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="tag-item tag"
        :class="{ duplicate: tag.text === duplicate }"
      >
        <button
          v-if="type.toUpperCase() === VariantOptionEnum.IMAGE.toUpperCase() && !tag.src"
          @click.prevent="openImagePopup(index)"
        >
          <q-icon name="image" />
        </button>
        <button
          v-if="type.toUpperCase() === VariantOptionEnum.IMAGE.toUpperCase() && tag.src"
          type="button"
          @click.prevent="openImagePopup(index)"
        >
          <img width="14" height="14" :src="tag.imageKey" >
        </button>
        <span class="r-ml-1 r-max-w-[150px] tag-content" :title="tag.text">{{ tag.text }}</span>
        <button class="delete" @click.prevent="removeTag(index)">
          <q-icon name="clear" />
        </button>
      </span>
      <input
        v-model="newTag"
        type="text"
        :list="id"
        autocomplete="off"
        :style="{ 'padding-left': `${paddingLeft}px` }"
        placeholder="Value"
        @keydown.enter.prevent="addTag(newTag)"
        @keydown.prevent.tab="addTag(newTag)"
        @keydown.delete="newTag.length || removeTag(tags.length - 1)"
        @blur.prevent="addTag(newTag)"
      >
    </div>
  </div>
</template>
<script setup>
import { ref, watch, nextTick } from 'vue'
import { VariantOptionEnum } from '@/helpers/enum'
import { randString } from '@/utils/common'

const props = defineProps({
  name: { type: String, default: '' },
  modelValue: { type: Array, default: () => [] },
  allowCustom: { type: Boolean, default: true },
  type: { type: String, default: VariantOptionEnum.TEXT }
})

const emits = defineEmits(['update:modelValue', 'open-image-popup', 'error'])

const tags = ref(props.modelValue)
const newTag = ref('')
const id = Math.random().toString(36).substring(7)

const addTag = (tag) => {
  if (!tag || !props.allowCustom) return
  let newItems = [...new Set(tag.split(',').filter((el) => el))]
  newItems = newItems.filter((el) => !checkDuplicate(el))
  newItems = newItems.map((el) => ({ text: el, src: '', id: randString(), imageKey: '' }))
  const combineItems = [...tags.value, ...newItems]
  tags.value = combineItems
  newTag.value = ''
  emits('update:modelValue', tags.value)
}
const removeTag = (index) => {
  tags.value.splice(index, 1)
}

const duplicate = ref(null)
const checkDuplicate = (tag) => {
  return tags.value.find((el) => el.text.toLowerCase().trim() === tag.toLowerCase().trim())
}

const paddingLeft = ref(10)
const onTagsChange = () => {
  emits('update:modelValue', tags.value)
  if (!tags.value.length) {
    emits('error', true)
  } else {
    emits('error', true)
  }
}

const openImagePopup = (index) => emits('open-image-popup', index)

watch(
  tags,
  async () => {
    await nextTick()
    onTagsChange()
  },
  { deep: true }
)
</script>
<style scoped lang="scss">
.tag-input {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  .content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #e8ebee;
    .tag-item {
      display: flex;
      margin: 3px;
      align-items: center;
    }
    .tag-content {
      @apply r-break-words r-whitespace-normal;
    }
  }
  .tag {
    background: transparent;
    padding: 5px;
    border-radius: 4px;
    color: #212221;
    white-space: nowrap;
    transition: 0.1s ease background;
    border: 1px solid #e8ebee;
  }
  input {
    padding: 10px;
    border: 0;
    background: transparent;
    flex: 1;
    min-width: 60px;
  }
  .delete {
    color: #212221;
    background: none;
    outline: none;
    border: none;
    cursor: pointer;
  }
}
@keyframes shake {
  10%,
  90% {
    transform: scale(0.9) translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: scale(0.9) translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: scale(0.9) translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: scale(0.9) translate3d(4px, 0, 0);
  }
}
.tag.duplicate {
  background: rgb(235, 27, 27);
  animation: shake 1s;
}
</style>
