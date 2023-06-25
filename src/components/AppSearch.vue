<template>
  <a-form
    ref="formRef"
    v-bind="formItemLayout"
    name="advanced_search"
    layout="inline"
    class="ant-advanced-search-form"
  >
    <a-row :gutter="[24, 16]" :wrap="true">
      <slot :model-ref="_formState" :validate-infos="validateInfos" name="formConent" />
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
import useForm from 'ant-design-vue/es/form/useForm'
type Props = Record<string, any>
const props = withDefaults(defineProps<{ modelValue: Props; rules?: Props }>(), {
  modelValue: () => ({}),
  rules: () => ({})
})
const _formState = reactive<typeof props.modelValue>(cloneDeep(props.modelValue))
const _rules = reactive<Props>(props.rules)
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const { resetFields, validate, validateInfos } = useForm(_formState, _rules)
const emit = defineEmits(['update:modelValue', 'search', 'reset'])
emit('update:modelValue', cloneDeep(_formState))
const onSubmit = () => {
  validate()
    .then(() => {
      emit('update:modelValue', cloneDeep(_formState))
      emit('search', _formState)
    })
    .catch((err) => {
      console.log('error', err)
    })
}
const onReset = () => {
  for (const key in _formState) {
    if (Object.prototype.hasOwnProperty.call(_formState, key)) {
      // params[key] = undefined as unknown as string
      _formState[key] = undefined as unknown as string
    }
  }
  console.log('_formState',_formState)
  resetFields()
  emit('update:modelValue', cloneDeep(_formState))
  emit('reset')
}
</script>

<style lang="scss" scoped>
.ant-advanced-search-form {
  margin-bottom: 15px;
}
</style>
