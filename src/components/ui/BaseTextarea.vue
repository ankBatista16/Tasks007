<template>
  <div>
    <label v-if="label" :for="id" class="block mb-1 font-medium">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      class="input min-h-[100px]"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      v-bind="$attrs"
    ></textarea>
    <p v-if="error" class="mt-1 text-sm text-error">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-textSecondary">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 4
  },
  id: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);

const id = computed(() => props.id || `textarea-${Math.random().toString(36).substring(2, 9)}`);
</script>
