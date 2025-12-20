<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" @click.self="close"></div>
          
          <div class="relative bg-surface border border-border rounded-lg shadow-lg max-w-md w-full mx-auto z-10">
            <div class="flex justify-between items-center p-4 border-b border-border">
              <h3 class="text-lg font-medium">{{ title }}</h3>
              <button 
                @click="close" 
                class="text-textSecondary hover:text-text-primary
"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            
            <div class="p-4">
              <slot></slot>
            </div>
            
            <div v-if="$slots.footer" class="p-4 border-t border-border">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Modal'
  }
});

const emit = defineEmits(['update:modelValue']);

function close() {
  emit('update:modelValue', false);
}

// Prevent body scrolling when modal is open
watch(() => props.modelValue, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, { immediate: true });
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
