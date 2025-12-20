<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-surface rounded-lg p-6 w-full max-w-lg">
      <h2 class="text-lg font-semibold mb-4">Editar Tarefa</h2>

      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Título
          </label>
          <input v-model="form.title" class="input" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Descrição
          </label>
          <textarea v-model="form.description" class="input" rows="4" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">
              Status
            </label>
            <select v-model="form.status" class="input">
              <option value="pendente">Pendente</option>
              <option value="em andamento">Em andamento</option>
              <option value="concluída">Concluída</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">
              Prioridade
            </label>
            <select v-model="form.priority" class="input">
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">
            Data de Vencimento
          </label>
          <input type="date" v-model="form.due_date" class="input" />
        </div>

        <div class="flex justify-end gap-3">
          <button type="button" class="btn-secondary" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading">Salvando...</span>
            <span v-else>Salvar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTasksStore } from "@/stores/tasks";
import type { Database } from "@/types/supabase";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

const props = defineProps<{ task: Task }>();
const emit = defineEmits(["close", "updated"]);

const tasksStore = useTasksStore();
const loading = ref(false);

const form = ref({
  title: props.task.title,
  description: props.task.description || "",
  status: props.task.status,
  priority: props.task.priority,
  due_date: props.task.due_date || "",
});

async function save() {
  loading.value = true;

  const result = await tasksStore.updateTask(props.task.id, {
    title: form.value.title,
    description: form.value.description || null,
    status: form.value.status,
    priority: form.value.priority,
    due_date: form.value.due_date || null,
  });

  loading.value = false;

  if (result.success) {
    emit("updated");
    emit("close");
  }
}
</script>
