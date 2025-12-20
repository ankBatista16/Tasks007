<template>
  <BaseCard :clickable="true" @click="navigateToTask" class="mb-3">
    <div>
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-medium">{{ task.title }}</h4>
        <BaseBadge :variant="priorityVariant">{{ priorityLabel }}</BaseBadge>
      </div>
      
      <p v-if="task.description" class="text-sm text-textSecondary mb-3 line-clamp-2">
        {{ task.description }}
      </p>
      
      <div class="flex justify-between items-center mt-3 pt-3 border-t border-border">
        <div class="flex items-center">
          <BaseAvatar 
            :name="task.assignee?.full_name || ''" 
            :src="task.assignee?.avatar_url || ''" 
            size="sm"
          />
          <span v-if="task.assignee" class="ml-2 text-xs">
            {{ task.assignee.full_name }}
          </span>
          <span v-else class="ml-2 text-xs text-textSecondary italic">
            Não atribuído
          </span>
        </div>
        
        <div v-if="task.due_date" class="text-xs" :class="dueDateClasses">
          {{ formattedDueDate }}
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { format, isPast, isToday, addDays, isBefore } from 'date-fns';
import type { Task } from '@/types';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseBadge from '@/components/ui/BaseBadge.vue';
import BaseAvatar from '@/components/ui/BaseAvatar.vue';

const props = defineProps<{
  task: Task;
}>();

const router = useRouter();

const priorityVariant = computed(() => {
  const variants = {
    low: 'secondary',
    medium: 'primary',
    high: 'warning',
    urgent: 'error'
  };
  
  return variants[props.task.priority];
});

const priorityLabel = computed(() => {
  const labels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente'
  };
  
  return labels[props.task.priority];
});

const formattedDueDate = computed(() => {
  if (!props.task.due_date) return '';
  
  try {
    const dueDate = new Date(props.task.due_date);
    
    if (isToday(dueDate)) {
      return 'Hoje';
    }
    
    return format(dueDate, 'dd/MM/yyyy');
  } catch (e) {
    return '';
  }
});

const dueDateClasses = computed(() => {
  if (!props.task.due_date) return '';
  
  try {
    const dueDate = new Date(props.task.due_date);
    
    if (isPast(dueDate) && props.task.status !== 'done') {
      return 'text-error';
    }
    
    if (isToday(dueDate) && props.task.status !== 'done') {
      return 'text-warning';
    }
    
    if (isBefore(dueDate, addDays(new Date(), 3)) && props.task.status !== 'done') {
      return 'text-warning';
    }
    
    return 'text-textSecondary';
  } catch (e) {
    return 'text-textSecondary';
  }
});

function navigateToTask() {
  router.push(`/tasks/${props.task.id}`);
}
</script>
