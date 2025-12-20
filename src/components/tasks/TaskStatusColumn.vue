<template>
  <div class="bg-surface border border-border rounded p-3 min-h-[300px] w-full">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-medium">{{ title }}</h3>
      <div
        class="bg-surface border border-border rounded-full px-2 py-0.5 text-xs"
      >
        {{ tasks.length }}
      </div>
    </div>

    <div class="space-y-3">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />

      <div
        v-if="tasks.length === 0"
        class="text-center py-8 text-textSecondary"
      >
        <p>Nenhuma tarefa</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "@/types";
import TaskCard from "@/components/tasks/TaskCard.vue";

defineProps<{
  title: string;
  tasks: Task[];
}>();
</script>
