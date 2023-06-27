<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  iconClass: string
  className?: string
  color?: string
}
const props = withDefaults(defineProps<Props>(), { iconClass: '', className: '', color: '' })
const iconName = computed(() => `#icon-${props.iconClass}`)
const svgClass = computed(() => `svg-icon ${props.className}`)
</script>

<style lang="scss" scoped></style>
