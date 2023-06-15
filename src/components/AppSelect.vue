<template>
  <a-select
    v-model:value="value"
    show-search
    :placeholder="placeholder"
    style="width: 200px"
    :options="searchOptions"
    :filter-option="filterOption"
    @change="handleChange"
  ></a-select>
</template>

<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue'
import { ref } from 'vue'
interface Props {
  value?: string | string[] | number | number[]
  placeholder?: string
  type: string
}
const props = withDefaults(defineProps<Props>(), {
  value: '',
  placeholder: '请选择',
  type: 'brand'
})
const value = ref<string | string[] | number | number[]>()
const searchOptions = ref<SelectProps['options']>([])
switch (props.type) {
  case 'brand':
    searchOptions.value = [
      { value: 'nike', label: 'nike' },
      { value: 'adidas', label: 'adidas' },
      { value: 'jordan', label: 'jordan' }
    ]
    break
  case 'store':
    searchOptions.value = [
      { value: '王府井店', label: '王府井店' },
      { value: '世贸店', label: '世贸店' },
      { value: '万达店', label: '万达店' }
    ]
}

const emit = defineEmits(['update:value'])
const handleChange: SelectProps['onChange'] = (value) => {
  emit('update:value', value)
}
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
}
</script>

<style lang="scss" scoped></style>
