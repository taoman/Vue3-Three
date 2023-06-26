<template>
  <a-select
    v-model:value="value"
    show-search
    :placeholder="placeholder"
    :style="{width:width+'px'} "
    :options="searchOptions"
    :filter-option="filterOption"
    @change="handleChange"
  ></a-select>
</template>

<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue'
import { ref, watch } from 'vue'
interface Props {
  value?: string | string[] | number | number[]
  width:number
  placeholder?: string
  type: string
}
const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  width: 200,
  placeholder: '',
  type: 'turbines'
})
const value = ref<string | string[] | number | number[]>()
watch(
  () => props.value,
  (val) => {
    value.value = val
  },
  {
    immediate: true
  }
)
const searchOptions = ref<SelectProps['options']>([])
switch (props.type) {
  case 'turbines':
    searchOptions.value = [
      { value: '1', label: '#1号风机' },
      { value: '2', label: '#2号风机' },
      { value: '3', label: '#3号风机' }
    ]
    break
  case 'witgets':
    searchOptions.value = [
      { value: '1', label: '发动机' },
      { value: '2', label: '齿轮箱' },
      { value: '3', label: '变桨系统' },
      { value: '4', label: '主轴' },
      { value: '5', label: '叶片' },
      { value: '6', label: '偏航角度' },
      { value: '7', label: '传送带' }
    ]
}

const emit = defineEmits(['update:value', 'change'])
const handleChange: SelectProps['onChange'] = (value) => {
  emit('update:value', value)
  // emit('change', value)
}
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
}
</script>

<style lang="scss" scoped></style>
