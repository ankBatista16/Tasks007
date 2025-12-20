<template>
  <div 
    :class="[
      'p-4 rounded border',
      variantClasses
    ]"
    role="alert"
  >
    <div class="flex">
      <div class="flex-shrink-0" v-if="icon">
        <span :class="iconClasses">{{ icon }}</span>
      </div>
      <div :class="{ 'ml-3': icon }">
        <h3 v-if="title" class="text-sm font-medium" :class="textClasses">{{ title }}</h3>
        <div :class="[textClasses, { 'mt-1': title }]">
          <slot></slot>
        </div>
      </div>
      <div class="ml-auto pl-3" v-if="dismissible">
        <button 
          @click="$emit('dismiss')"
          class="inline-flex rounded-md p-1.5"
          :class="buttonClasses"
        >
          <span class="sr-only">Fechar</span>
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (value: string) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  dismissible: {
    type: Boolean,
    default: false
  }
});

defineEmits(['dismiss']);

const variantClasses = computed(() => {
  const classes = {
    info: 'bg-primary/10 border-primary/30 text-primary',
    success: 'bg-success/10 border-success/30 text-success',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    error: 'bg-error/10 border-error/30 text-error'
  };
  
  return classes[props.variant as keyof typeof classes];
});

const textClasses = computed(() => {
  const classes = {
    info: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error'
  };
  
  return classes[props.variant as keyof typeof classes];
});

const iconClasses = computed(() => {
  const classes = {
    info: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error'
  };
  
  return classes[props.variant as keyof typeof classes];
});

const buttonClasses = computed(() => {
  const classes = {
    info: 'hover:bg-primary/20',
    success: 'hover:bg-success/20',
    warning: 'hover:bg-warning/20',
    error: 'hover:bg-error/20'
  };
  
  return classes[props.variant as keyof typeof classes];
});
</script>
