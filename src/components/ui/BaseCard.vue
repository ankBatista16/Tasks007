<template>
  <div class="card" :class="{ 'hover:border-primary cursor-pointer': clickable }" v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  clickable: {
    type: Boolean,
    default: false
  }
});
</script>
