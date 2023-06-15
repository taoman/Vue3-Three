<template>
  <a-form ref="formRef" v-bind="formItemLayout" name="advanced_search" layout="inline" class="ant-advanced-search-form">
    <a-row :gutter="[24,16]" :wrap="true">
    <slot :model-ref="_formState" name="formConent" />
    <a-form-item>
      <a-space>
        <a-button type="primary" @click.prevent="onSubmit"> 查询 </a-button>
        <a-button @click="onReset"> 重置 </a-button>
      </a-space>
    </a-form-item>
  </a-row>
  </a-form>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { reactive } from 'vue'

type Props = Record<string, any>
const props = defineProps<{ modelValue: Props }>()
const _formState = reactive<Props>(cloneDeep(props.modelValue))
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol:{ span: 16 },
};
const emit = defineEmits(['update:modelValue', 'search', 'reset'])
emit('update:modelValue', cloneDeep(_formState))
const onSubmit = () => {
  emit('update:modelValue', cloneDeep(_formState))
  emit('search', _formState)
}
const onReset = () => {
  console.log('onReset')
}
</script>

<style lang="scss" scoped>
.ant-advanced-search-form {
  margin-bottom: 15px;
}
</style>
