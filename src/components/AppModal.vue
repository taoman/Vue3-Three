<template>
  <a-modal
    v-model:open="visible"
    title="Title"
    :confirm-loading="loading"
    okText="确定"
    cancelText="取消"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <slot></slot>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
interface Props {
  modalVisible: boolean
  confirmLoading: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modalVisible: false,
  confirmLoading: false
})
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
watch(props,(val)=>{
  visible.value = val.modalVisible
  loading.value = val.confirmLoading
})
const emit = defineEmits(['update:modalVisible', 'ok', 'cancel'])
const handleOk = () => {
  emit('ok')
}
const handleCancel = () => {
  emit('update:modalVisible', false)
  emit('cancel')
}
</script>

<style lang="scss" scoped></style>
