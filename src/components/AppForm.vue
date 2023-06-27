<template>
  <a-form ref="formRef" name="custom-validation" v-bind="layout">
    <slot :model-ref="_formState" :validate-infos="validateInfos" name="formContent"></slot>
    <slot name="formFot">
      <a-form-item v-if="_isSubmit" :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" @click="handleSubmit">Submit</a-button>
        <a-button @click="onReset"> Reset </a-button>
      </a-form-item>
    </slot>
  </a-form>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { reactive, ref } from 'vue'
import useForm from 'ant-design-vue/es/form/useForm'
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 }
}
type Props = Record<string, any>
const props = withDefaults(defineProps<{ modelValue?: Props; rules?: Props }>(), {
  modelValue: () => ({}),
  rules: () => ({}),
  isSubmit: true
})
const _formState = reactive<typeof props.modelValue>(cloneDeep(props.modelValue))
const _rules = reactive<typeof props.rules>(props.rules)
const _isSubmit = ref<boolean>(props.isSubmit)
const { resetFields, validate, validateInfos } = useForm(_formState, _rules)
const formRef = ref(null)
const emit = defineEmits(['update:modelValue', 'finish', 'reset'])
const handleSubmit = async () => {
  validate()
    .then(() => {
      emit('finish', _formState)
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
      console.log('key', _formState[key])

    }   
  }
  resetFields()
  console.log('_formState',_formState)
  emit('update:modelValue', cloneDeep(_formState))
  emit('reset')
}
</script>

<style lang="scss" scoped></style>
