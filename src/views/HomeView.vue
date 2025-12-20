<template>
  <div>
    <header class="mb-8">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-text-secondary">Bem-vindo ao seu painel de controle</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Card de Projetos -->
      <div
        class="card bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">Projetos</h3>
          <div
            class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
              />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold mb-2">{{ stats.projects.total }}</div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-text-secondary"
            >{{ stats.projects.active }} ativos</span
          >
          <router-link to="/projects" class="text-primary hover:underline"
            >Ver todos</router-link
          >
        </div>
      </div>

      <!-- Card de Tarefas -->
      <div
        class="card bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">Tarefas</h3>
          <div
            class="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-secondary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fill-rule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold mb-2">{{ stats.tasks.total }}</div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-text-secondary"
            >{{ stats.tasks.pending }} pendentes</span
          >
          <router-link to="/tasks" class="text-secondary hover:underline"
            >Ver todas</router-link
          >
        </div>
      </div>

      <!-- Card de Tarefas Atrasadas -->
      <div
        class="card bg-gradient-to-br from-error/20 to-error/5 border-error/30"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">Atrasadas</h3>
          <div
            class="h-10 w-10 rounded-full bg-error/20 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-error"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold mb-2">{{ stats.tasks.overdue }}</div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-text-secondary">Tarefas atrasadas</span>
          <router-link to="/tasks" class="text-error hover:underline"
            >Ver todas</router-link
          >
        </div>
      </div>

      <!-- Card de Tarefas Concluídas -->
      <div
        class="card bg-gradient-to-br from-success/20 to-success/5 border-success/30"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">Concluídas</h3>
          <div
            class="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-success"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold mb-2">{{ stats.tasks.completed }}</div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-text-secondary">Tarefas concluídas</span>
          <router-link to="/tasks" class="text-success hover:underline"
            >Ver todas</router-link
          >
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Tarefas Recentes -->
      <div class="lg:col-span-2 card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold">Tarefas Recentes</h2>
          <router-link to="/tasks" class="text-primary text-sm hover:underline"
            >Ver todas</router-link
          >
        </div>

        <div v-if="loading.tasks" class="py-4 text-center text-text-secondary">
          Carregando tarefas...
        </div>

        <div
          v-else-if="!recentTasks.length"
          class="py-4 text-center text-text-secondary"
        >
          Nenhuma tarefa encontrada
        </div>

        <div v-else>
          <div
            v-for="task in recentTasks"
            :key="task.id"
            class="border-b border-border last:border-b-0 py-3"
          >
            <div class="flex justify-between items-start">
              <div>
                <router-link
                  :to="`/tasks/${task.id}`"
                  class="font-medium hover:text-primary"
                >
                  {{ task.title }}
                </router-link>
                <p class="text-sm text-text-secondary">
                  Projeto: {{ task.project_name }}
                </p>
              </div>

              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="{
                  'bg-warning/20 text-warning': task.status === 'planejado',
                  'bg-primary/20 text-primary': task.status === 'em andamento',
                  'bg-success/20 text-success': task.status === 'concluída',
                }"
              >
                {{ task.status }}
              </span>
            </div>

            <div
              class="flex justify-between items-center mt-2 text-xs text-text-secondary"
            >
              <div class="flex items-center">
                <span
                  class="px-2 py-1 rounded-full mr-2"
                  :class="{
                    'bg-error/20 text-error': task.priority === 'alta',
                    'bg-warning/20 text-warning': task.priority === 'média',
                    'bg-success/20 text-success': task.priority === 'baixa',
                  }"
                >
                  {{ task.priority }}
                </span>
                <span v-if="task.due_date"
                  >Prazo: {{ formatDate(task.due_date) }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Projetos Recentes -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold">Projetos Recentes</h2>
          <router-link
            to="/projects"
            class="text-primary text-sm hover:underline"
            >Ver todos</router-link
          >
        </div>

        <div
          v-if="loading.projects"
          class="py-4 text-center text-text-secondary"
        >
          Carregando projetos...
        </div>

        <div
          v-else-if="!recentProjects.length"
          class="py-4 text-center text-text-secondary"
        >
          Nenhum projeto encontrado
        </div>

        <div v-else>
          <div
            v-for="project in recentProjects"
            :key="project.id"
            class="border-b border-border last:border-b-0 py-3"
          >
            <router-link
              :to="`/projects/${project.id}`"
              class="font-medium hover:text-primary"
            >
              {{ project.name }}
            </router-link>

            <div class="flex justify-between items-center mt-2">
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="{
                  'bg-warning/20 text-warning': project.status === 'planejado',
                  'bg-primary/20 text-primary':
                    project.status === 'em andamento',
                  'bg-success/20 text-success': project.status === 'concluído',
                }"
              >
                {{ project.status }}
              </span>

              <span class="text-xs text-text-secondary">
                {{ project.tasks_count || 0 }} tarefas
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/supabase";
import { useAuthStore } from "@/stores/auth";
import type { Database } from "@/types/supabase";

type Task = Database["public"]["Tables"]["tasks"]["Row"] & {
  project_name?: string;
};

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  tasks_count?: number;
};

const authStore = useAuthStore();

const stats = ref({
  projects: {
    total: 0,
    active: 0,
  },
  tasks: {
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
  },
});

const recentTasks = ref<Task[]>([]);
const recentProjects = ref<Project[]>([]);

const loading = ref({
  stats: true,
  tasks: true,
  projects: true,
});

onMounted(async () => {
  if (!authStore.user) return;

  await Promise.all([fetchStats(), fetchRecentTasks(), fetchRecentProjects()]);
});

/* =========================
   📊 ESTATÍSTICAS
========================= */
async function fetchStats() {
  if (!authStore.user) return;

  try {
    loading.value.stats = true;

    /* ---------- PROJETOS ---------- */

    const { data: ownedProjects } = await supabase
      .from("projects")
      .select("id, status")
      .eq("created_by", authStore.user.id);

    const { data: memberProjects } = await supabase
      .from("project_members")
      .select(`project:projects(id, status)`)
      .eq("user_id", authStore.user.id);

    const projectMap = new Map<string, { id: string; status: string }>();

    ownedProjects?.forEach((p) => projectMap.set(p.id, p));
    memberProjects?.forEach((row) => {
      if (row.project) projectMap.set(row.project.id, row.project);
    });

    const allProjects = Array.from(projectMap.values());

    stats.value.projects.total = allProjects.length;
    stats.value.projects.active = allProjects.filter(
      (p) => p.status === "em andamento"
    ).length;

    /* ---------- TAREFAS ---------- */

    const { data: createdTasks } = await supabase
      .from("tasks")
      .select("id, status, due_date")
      .eq("created_by", authStore.user.id);

    const { data: leaderTasks } = await supabase
      .from("tasks")
      .select("id, status, due_date")
      .eq("leader_id", authStore.user.id);

    const { data: memberTasks } = await supabase
      .from("task_members")
      .select(`task:tasks(id, status, due_date)`)
      .eq("user_id", authStore.user.id);

    const taskMap = new Map<string, any>();

    createdTasks?.forEach((t) => taskMap.set(t.id, t));
    leaderTasks?.forEach((t) => taskMap.set(t.id, t));
    memberTasks?.forEach((row) => {
      if (row.task) taskMap.set(row.task.id, row.task);
    });

    const allTasks = Array.from(taskMap.values());

    stats.value.tasks.total = allTasks.length;
    stats.value.tasks.pending = allTasks.filter(
      (t) => t.status === "pendente"
    ).length;

    stats.value.tasks.completed = allTasks.filter(
      (t) => t.status === "concluída"
    ).length;

    const today = new Date();
    stats.value.tasks.overdue = allTasks.filter(
      (t) =>
        (t.status === "pendente" || t.status === "em andamento") &&
        t.due_date &&
        new Date(t.due_date) < today
    ).length;
  } catch (err) {
    console.error("Erro ao buscar estatísticas:", err);
  } finally {
    loading.value.stats = false;
  }
}

/* =========================
   📝 TAREFAS RECENTES
========================= */
async function fetchRecentTasks() {
  if (!authStore.user) return;

  try {
    loading.value.tasks = true;

    const { data: createdTasks } = await supabase
      .from("tasks")
      .select(`*, project:projects!tasks_project_id_fkey(name)`)
      .eq("created_by", authStore.user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: leaderTasks } = await supabase
      .from("tasks")
      .select(`*, project:projects!tasks_project_id_fkey(name)`)
      .eq("leader_id", authStore.user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: memberTasks } = await supabase
      .from("task_members")
      .select(`task:tasks(*, project:projects!tasks_project_id_fkey(name))`)
      .eq("user_id", authStore.user.id);

    const map = new Map<string, Task>();

    createdTasks?.forEach((t) =>
      map.set(t.id, { ...t, project_name: t.project?.name })
    );
    leaderTasks?.forEach((t) =>
      map.set(t.id, { ...t, project_name: t.project?.name })
    );
    memberTasks?.forEach((row) => {
      if (row.task) {
        map.set(row.task.id, {
          ...row.task,
          project_name: row.task.project?.name,
        });
      }
    });

    recentTasks.value = Array.from(map.values()).slice(0, 5);
  } catch (err) {
    console.error("Erro ao buscar tarefas recentes:", err);
  } finally {
    loading.value.tasks = false;
  }
}

/* =========================
   📁 PROJETOS RECENTES
========================= */
async function fetchRecentProjects() {
  if (!authStore.user) return;

  try {
    loading.value.projects = true;

    const { data: ownedProjects } = await supabase
      .from("projects")
      .select(`*, tasks:tasks(id)`)
      .eq("created_by", authStore.user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: memberProjects } = await supabase
      .from("project_members")
      .select(`project:projects(*, tasks:tasks(id))`)
      .eq("user_id", authStore.user.id);

    const map = new Map<string, Project>();

    ownedProjects?.forEach((p) =>
      map.set(p.id, { ...p, tasks_count: p.tasks?.length || 0 })
    );

    memberProjects?.forEach((row) => {
      if (row.project) {
        map.set(row.project.id, {
          ...row.project,
          tasks_count: row.project.tasks?.length || 0,
        });
      }
    });

    recentProjects.value = Array.from(map.values()).slice(0, 5);
  } catch (err) {
    console.error("Erro ao buscar projetos recentes:", err);
  } finally {
    loading.value.projects = false;
  }
}

/* =========================
   📅 UTIL
========================= */
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy", { locale: ptBR });
}
</script>
