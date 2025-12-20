<template>
  <BaseCard :clickable="true" @click="navigateToProject" class="h-full">
    <div class="flex flex-col h-full">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-semibold">{{ project.name }}</h3>
        <BaseBadge :variant="statusVariant">{{ statusLabel }}</BaseBadge>
      </div>
      
      <p v-if="project.description" class="text-textSecondary mb-4 line-clamp-2">
        {{ project.description }}
      </p>
      <p v-else class="text-textSecondary mb-4 italic">
        Sem descrição
      </p>
      
      <div class="mt-auto pt-4 border-t border-border">
        <div class="flex justify-between items-center">
          <div class="flex -space-x-2">
            <BaseAvatar 
              v-for="member in displayMembers" 
              :key="member.user_id" 
              :name="member.user?.full_name || ''" 
              :src="member.user?.avatar_url || ''" 
              size="sm"
            />
            <div 
              v-if="extraMembersCount > 0" 
              class="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs"
            >
              +{{ extraMembersCount }}
            </div>
          </div>
          
          <div class="text-sm text-textSecondary">
            {{ formattedDate }}
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import type { Project } from '@/types';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseBadge from '@/components/ui/BaseBadge.vue';
import BaseAvatar from '@/components/ui/BaseAvatar.vue';

const props = defineProps<{
  project: Project;
}>();

const router = useRouter();

const statusVariant = computed(() => {
  const variants = {
    active: 'primary',
    completed: 'success',
    archived: 'secondary'
  };
  
  return variants[props.project.status];
});

const statusLabel = computed(() => {
  const labels = {
    active: 'Ativo',
    completed: 'Concluído',
    archived: 'Arquivado'
  };
  
  return labels[props.project.status];
});

const formattedDate = computed(() => {
  try {
    return format(new Date(props.project.updated_at), 'dd/MM/yyyy');
  } catch (e) {
    return '';
  }
});

const displayMembers = computed(() => {
  return props.project.members?.slice(0, 3) || [];
});

const extraMembersCount = computed(() => {
  const total = props.project.members?.length || 0;
  return Math.max(0, total - 3);
});

function navigateToProject() {
  router.push(`/projects/${props.project.id}`);
}
</script>
