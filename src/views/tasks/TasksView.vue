<template>
  <div>
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">Tarefas</h1>
        <p class="text-text-secondary">
          Gerencie suas tarefas em todos os projetos
        </p>
      </div>
    </header>

    <div class="card mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="w-full md:w-auto">
          <label
            for="status-filter"
            class="block text-sm font-medium text-text-secondary mb-1"
            >Status</label
          >
          <select id="status-filter" v-model="filters.status" class="input">
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="em andamento">Em Andamento</option>
            <option value="concluída">Concluída</option>
          </select>
        </div>

        <div class="w-full md:w-auto">
          <label
            for="priority-filter"
            class="block text-sm font-medium text-text-secondary mb-1"
            >Prioridade</label
          >
          <select id="priority-filter" v-model="filters.priority" class="input">
            <option value="">Todas</option>
            <option value="baixa">Baixa</option>
            <option value="média">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div class="w-full md:w-auto">
          <label
            for="project-filter"
            class="block text-sm font-medium text-text-secondary mb-1"
            >Projeto</label
          >
          <select id="project-filter" v-model="filters.projectId" class="input">
            <option value="">Todos</option>
            <option
              v-for="project in projects"
              :key="project.id"
              :value="project.id"
            >
              {{ project.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-pulse text-text-secondary">Carregando tarefas...</div>
    </div>

    <div
      v-else-if="error"
      class="bg-error/10 border border-error text-error p-4 rounded-lg"
    >
      {{ error }}
    </div>

    <div
      v-else-if="!filteredTasks.length"
      class="bg-surface border border-border p-8 rounded-lg text-center"
    >
      <h3 class="text-xl font-medium mb-2">Nenhuma tarefa encontrada</h3>
      <p class="text-text-secondary mb-6">
        Não há tarefas que correspondam aos filtros selecionados
      </p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="card hover:border-primary/50 transition-colors"
      >
        <div class="flex justify-between items-start">
          <div>
            <router-link
              :to="`/tasks/${task.id}`"
              class="text-lg font-semibold hover:text-primary"
            >
              {{ task.title }}
            </router-link>
            <p class="text-sm text-text-secondary mt-1">
              Projeto: {{ task.project_name }}
            </p>
          </div>

          <div class="flex items-center space-x-2">
            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="{
                'bg-warning/20 text-warning': task.status === 'pendente',
                'bg-primary/20 text-primary': task.status === 'em andamento',
                'bg-success/20 text-success': task.status === 'concluída',
              }"
            >
              {{ task.status }}
            </span>

            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="{
                'bg-error/20 text-error': task.priority === 'alta',
                'bg-warning/20 text-warning': task.priority === 'média',
                'bg-success/20 text-success': task.priority === 'baixa',
              }"
            >
              {{ task.priority }}
            </span>
          </div>
        </div>

        <p
          v-if="task.description"
          class="text-text-secondary my-4 line-clamp-2"
        >
          {{ task.description }}
        </p>

        <div class="flex justify-between items-center mt-4 text-sm">
          <div class="flex items-center">
            <div v-if="task.leader_name" class="flex items-center mr-4">
              <span class="text-text-secondary">Responsável:</span>
              <span class="ml-1">{{ task.leader_name }}</span>
            </div>

            <div v-if="task.due_date" class="flex items-center">
              <span class="text-text-secondary">Prazo:</span>
              <span
                class="ml-1"
                :class="{ 'text-error': isOverdue(task.due_date) }"
              >
                {{ formatDate(task.due_date) }}
              </span>
            </div>
          </div>

          <router-link :to="`/tasks/${task.id}`" class="btn-secondary text-sm">
            Ver Detalhes
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { format, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/supabase";
import { useAuthStore } from "@/stores/auth";
import type { Database } from "@/types/supabase";

type Task = Database["public"]["Tables"]["tasks"]["Row"] & {
  leader_name?: string;
  project_name?: string;
};

type Project = Database["public"]["Tables"]["projects"]["Row"];

const authStore = useAuthStore();

const tasks = ref<Task[]>([]);
const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const filters = ref({
  status: "",
  priority: "",
  projectId: "",
});

const filteredTasks = computed(() =>
  tasks.value.filter((task) => {
    if (filters.value.status && task.status !== filters.value.status)
      return false;
    if (filters.value.priority && task.priority !== filters.value.priority)
      return false;
    if (filters.value.projectId && task.project_id !== filters.value.projectId)
      return false;
    return true;
  })
);

onMounted(async () => {
  if (!authStore.user) return;
  await Promise.all([fetchTasks(), fetchProjects()]);
});

/* ------------------------------------------------
 * TASKS
 * --------------------------------------------- */
async function fetchTasks() {
  if (!authStore.user) return;

  try {
    loading.value = true;
    error.value = null;

    const userId = authStore.user.id;

    // 1️⃣ busca ids das tasks onde o usuário é membro
    const { data: memberRows, error: memberErr } = await supabase
      .from("task_members")
      .select("task_id")
      .eq("user_id", userId);

    if (memberErr) throw memberErr;

    const memberTaskIds = memberRows?.map((r) => r.task_id) ?? [];

    // 2️⃣ busca tarefas
    const { data, error: err } = await supabase
      .from("tasks")
      .select(
        `
        *,
        leader:users_profile!tasks_leader_id_fkey(name),
        project:projects!tasks_project_id_fkey(name)
      `
      )
      .or(`created_by.eq.${userId},leader_id.eq.${userId}`)
      .in(
        "id",
        memberTaskIds.length
          ? memberTaskIds
          : ["00000000-0000-0000-0000-000000000000"]
      )
      .order("created_at", { ascending: false });

    if (err) throw err;

    tasks.value = (data ?? []).map((task) => ({
      ...task,
      leader_name: task.leader?.name,
      project_name: task.project?.name,
    }));
  } catch (err: any) {
    console.error("Erro ao buscar tarefas:", err);
    error.value = err.message ?? "Erro ao carregar tarefas";
  } finally {
    loading.value = false;
  }
}

/* ------------------------------------------------
 * PROJECTS
 * --------------------------------------------- */
async function fetchProjects() {
  if (!authStore.user) return;

  try {
    const userId = authStore.user.id;

    const { data: memberRows, error: memberErr } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("user_id", userId);

    if (memberErr) throw memberErr;

    const memberProjectIds = memberRows?.map((r) => r.project_id) ?? [];

    const { data, error: err } = await supabase
      .from("projects")
      .select("*")
      .or(`created_by.eq.${userId}`)
      .in(
        "id",
        memberProjectIds.length
          ? memberProjectIds
          : ["00000000-0000-0000-0000-000000000000"]
      )
      .order("name", { ascending: true });

    if (err) throw err;

    projects.value = data ?? [];
  } catch (err) {
    console.error("Erro ao buscar projetos:", err);
  }
}

/* ------------------------------------------------
 * HELPERS
 * --------------------------------------------- */
function formatDate(dateString: string) {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
}

function isOverdue(dateString: string) {
  return isPast(parseISO(dateString));
}
</script>

