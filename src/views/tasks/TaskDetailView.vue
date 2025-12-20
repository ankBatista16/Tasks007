<template>
  <div>
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-pulse text-text-secondary">Carregando tarefa...</div>
    </div>

    <div
      v-else-if="error"
      class="bg-error/10 border border-error text-error p-4 rounded-lg"
    >
      {{ error }}
    </div>

    <div
      v-else-if="!task"
      class="bg-surface border border-border p-8 rounded-lg text-center"
    >
      <h3 class="text-xl font-medium mb-2">Tarefa não encontrada</h3>
      <p class="text-text-secondary mb-6">
        A tarefa que você está procurando não existe ou foi removida
      </p>

      <router-link to="/tasks" class="btn-primary">
        Voltar para Tarefas
      </router-link>
    </div>

    <div v-else>
      <header class="mb-8">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-bold">{{ task.title }}</h1>
              <span
                class="text-sm px-3 py-1 rounded-full"
                :class="{
                  'bg-warning/20 text-warning': task.status === 'pendente',
                  'bg-primary/20 text-primary': task.status === 'em andamento',
                  'bg-success/20 text-success': task.status === 'concluída',
                }"
              >
                {{ task.status }}
              </span>
            </div>
            <p class="text-text-secondary mt-1">
              Projeto:
              <router-link
                :to="`/projects/${task.project_id}`"
                class="hover:text-primary"
                >{{ task.project_name }}</router-link
              >
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="canEditTask"
              @click="showEditModal = true"
              class="btn-secondary"
            >
              Editar
            </button>

            <button
              v-if="canEditTask && task.status !== 'concluída'"
              @click="markAsCompleted"
              class="btn-success"
            >
              Marcar como Concluída
            </button>

            <button
              v-if="canEditTask && task.status === 'concluída'"
              @click="reopenTask"
              class="btn-warning"
            >
              Reabrir Tarefa
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 mt-4">
          <div class="text-sm">
            <span class="text-text-secondary">Prioridade:</span>
            <span
              class="ml-1 px-2 py-0.5 rounded-full"
              :class="{
                'bg-error/20 text-error': task.priority === 'alta',
                'bg-warning/20 text-warning': task.priority === 'média',
                'bg-success/20 text-success': task.priority === 'baixa',
              }"
            >
              {{ task.priority }}
            </span>
          </div>

          <div v-if="task.due_date" class="text-sm">
            <span class="text-text-secondary">Prazo:</span>
            <span
              class="ml-1"
              :class="{ 'text-error': isOverdue(task.due_date) }"
            >
              {{ formatDate(task.due_date) }}
            </span>
          </div>

          <div v-if="task.created_at" class="text-sm text-text-secondary">
            <span>Criada em:</span>
            <span class="ml-1">{{ formatDate(task.created_at) }}</span>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card mb-6">
            <h2 class="text-lg font-semibold mb-4">Descrição</h2>
            <p
              v-if="task.description"
              class="text-text-secondary whitespace-pre-line"
            >
              {{ task.description }}
            </p>
            <p v-else class="text-text-secondary italic">
              Nenhuma descrição fornecida
            </p>
          </div>

          <div class="card mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">Comentários</h2>

              <button
                @click="showAddCommentModal = true"
                class="btn-primary text-sm"
              >
                Adicionar Comentário
              </button>
            </div>

            <div v-if="commentsLoading" class="py-4 text-text-secondary">
              Carregando comentários...
            </div>

            <div
              v-else-if="!comments.length"
              class="py-4 text-text-secondary text-center"
            >
              <p>Nenhum comentário ainda</p>
              <button
                @click="showAddCommentModal = true"
                class="btn-primary mt-4"
              >
                Adicionar Primeiro Comentário
              </button>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="border-b border-border last:border-b-0 pb-4 mb-4 last:mb-0"
              >
                <div class="flex justify-between items-start">
                  <div class="flex items-start">
                    <div
                      v-if="comment.user_avatar"
                      class="h-10 w-10 rounded-full bg-cover bg-center mr-3"
                      :style="{
                        backgroundImage: `url(${comment.user_avatar})`,
                      }"
                    ></div>
                    <div
                      v-else
                      class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white mr-3"
                    >
                      {{ getInitials(comment.user_name || "Usuário") }}
                    </div>

                    <div>
                      <div class="flex items-center">
                        <span class="font-medium">{{
                          comment.user_name || "Usuário"
                        }}</span>
                        <span class="text-xs text-text-secondary ml-2">
                          {{ formatRelativeTime(comment.created_at) }}
                        </span>
                      </div>
                      <p class="text-text-secondary mt-1 whitespace-pre-line">
                        {{ comment.content }}
                      </p>
                    </div>
                  </div>

                  <button
                    v-if="comment.user_id === authStore.user?.id"
                    @click="deleteComment(comment.id)"
                    class="text-error hover:text-error/80 text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">Anexos</h2>

              <button
                @click="showAddAttachmentModal = true"
                class="btn-primary text-sm"
              >
                Adicionar Anexo
              </button>
            </div>

            <div v-if="attachmentsLoading" class="py-4 text-text-secondary">
              Carregando anexos...
            </div>

            <div
              v-else-if="!attachments.length"
              class="py-4 text-text-secondary text-center"
            >
              <p>Nenhum anexo ainda</p>
              <button
                @click="showAddAttachmentModal = true"
                class="btn-primary mt-4"
              >
                Adicionar Primeiro Anexo
              </button>
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="attachment in attachments"
                :key="attachment.id"
                class="flex justify-between items-center p-3 border border-border rounded-lg"
              >
                <div class="flex items-center">
                  <div
                    class="h-10 w-10 rounded bg-primary/20 flex items-center justify-center text-primary mr-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>

                  <div>
                    <a
                      :href="attachment.file_url"
                      target="_blank"
                      class="font-medium hover:text-primary"
                    >
                      {{ attachment.name }}
                    </a>
                    <div class="flex items-center text-xs text-text-secondary">
                      <span>{{
                        formatRelativeTime(attachment.created_at)
                      }}</span>
                      <span class="mx-1">•</span>
                      <span>Por {{ attachment.user_name || "Usuário" }}</span>
                    </div>
                  </div>
                </div>

                <button
                  v-if="
                    attachment.user_id === authStore.user?.id || canEditTask
                  "
                  @click="deleteAttachment(attachment.id)"
                  class="text-error hover:text-error/80 text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="card mb-6">
            <h2 class="text-lg font-semibold mb-4">Responsável</h2>

            <div v-if="task.leader_id" class="flex items-center">
              <div
                v-if="task.leader_avatar"
                class="h-12 w-12 rounded-full bg-cover bg-center mr-3"
                :style="{ backgroundImage: `url(${task.leader_avatar})` }"
              ></div>
              <div
                v-else
                class="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white mr-3"
              >
                {{ getInitials(task.leader_name || "Usuário") }}
              </div>

              <div>
                <p class="font-medium">{{ task.leader_name || "Usuário" }}</p>
                <p class="text-xs text-text-secondary">Responsável principal</p>
              </div>
            </div>

            <div v-else class="text-text-secondary">
              Nenhum responsável designado
            </div>

            <button
              v-if="canEditTask"
              @click="showChangeLeaderModal = true"
              class="btn-secondary mt-4 w-full"
            >
              {{
                task.leader_id ? "Alterar Responsável" : "Designar Responsável"
              }}
            </button>
          </div>

          <div class="card mb-6">
            <h2 class="text-lg font-semibold mb-4">Membros da Tarefa</h2>

            <div v-if="membersLoading" class="py-4 text-text-secondary">
              Carregando membros...
            </div>

            <div v-else-if="!members.length" class="py-4 text-text-secondary">
              <p>Nenhum membro adicional</p>
              <button
                v-if="canEditTask"
                @click="showAddMemberModal = true"
                class="btn-secondary mt-4 w-full"
              >
                Adicionar Membros
              </button>
            </div>

            <div v-else>
              <div
                v-for="member in members"
                :key="member.id"
                class="flex items-center justify-between py-2 border-b border-border last:border-b-0"
              >
                <div class="flex items-center">
                  <div
                    v-if="member.avatar_url"
                    class="h-8 w-8 rounded-full bg-cover bg-center mr-3"
                    :style="{ backgroundImage: `url(${member.avatar_url})` }"
                  ></div>
                  <div
                    v-else
                    class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-3"
                  >
                    {{ getInitials(member.name) }}
                  </div>
                  <p class="font-medium">{{ member.name }}</p>
                </div>

                <button
                  v-if="canEditTask"
                  @click="removeMember(member.id)"
                  class="text-error hover:text-error/80 text-sm"
                >
                  Remover
                </button>
              </div>

              <button
                v-if="canEditTask"
                @click="showAddMemberModal = true"
                class="btn-secondary mt-4 w-full"
              >
                Adicionar Membros
              </button>
            </div>
          </div>

          <div class="card">
            <h2 class="text-lg font-semibold mb-4">Ações</h2>

            <div class="space-y-3">
              <button
                v-if="canEditTask"
                @click="showEditModal = true"
                class="btn-secondary w-full"
              >
                Editar Tarefa
              </button>

              <button
                v-if="canEditTask"
                @click="confirmDelete"
                class="btn-danger w-full"
              >
                Excluir Tarefa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de adição de comentário -->
    <div
      v-if="showAddCommentModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">Adicionar Comentário</h2>

        <form @submit.prevent="addComment">
          <div class="mb-6">
            <label
              for="comment"
              class="block text-sm font-medium text-text-secondary mb-1"
              >Comentário</label
            >
            <textarea
              id="comment"
              v-model="newComment"
              rows="4"
              required
              class="input"
              :disabled="commentLoading"
              placeholder="Digite seu comentário..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddCommentModal = false"
              class="btn-secondary"
              :disabled="commentLoading"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="commentLoading"
            >
              <span v-if="commentLoading">Enviando...</span>
              <span v-else>Adicionar</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de adição de anexo -->
    <div
      v-if="showAddAttachmentModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">Adicionar Anexo</h2>

        <form @submit.prevent="addAttachment">
          <div class="mb-4">
            <label
              for="attachment-name"
              class="block text-sm font-medium text-text-secondary mb-1"
              >Nome do Anexo</label
            >
            <input
              id="attachment-name"
              v-model="newAttachment.name"
              type="text"
              required
              class="input"
              :disabled="attachmentLoading"
              placeholder="Nome do arquivo"
            />
          </div>

          <div class="mb-6">
            <label
              for="attachment-url"
              class="block text-sm font-medium text-text-secondary mb-1"
              >URL do Arquivo</label
            >
            <input
              id="attachment-url"
              v-model="newAttachment.url"
              type="url"
              required
              class="input"
              :disabled="attachmentLoading"
              placeholder="https://exemplo.com/arquivo.pdf"
            />
            <p class="mt-1 text-xs text-text-secondary">
              Insira a URL de um arquivo já hospedado online.
            </p>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddAttachmentModal = false"
              class="btn-secondary"
              :disabled="attachmentLoading"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="attachmentLoading"
            >
              <span v-if="attachmentLoading">Enviando...</span>
              <span v-else>Adicionar</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Outros modais (edição, alteração de responsável, etc.) seriam implementados de forma similar -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { format, formatDistance, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/supabase";
import { useAuthStore } from "@/stores/auth";
import type { Database } from "@/types/supabase";

/* =======================
   TYPES
======================= */

type Task = Database["public"]["Tables"]["tasks"]["Row"] & {
  project_name?: string;
  leader_name?: string;
};

type Comment = Database["public"]["Tables"]["task_notes"]["Row"] & {
  user_name?: string;
  content?: string;
};

type Attachment = Database["public"]["Tables"]["attachments"]["Row"] & {
  name?: string;
  user_name?: string;
};

type Member = {
  id: string;
  user_id: string;
  name: string;
};

/* =======================
   SETUP
======================= */

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const taskId = route.params.id as string;

/* =======================
   STATE
======================= */

const task = ref<Task | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const comments = ref<Comment[]>([]);
const commentsLoading = ref(true);

const attachments = ref<Attachment[]>([]);
const attachmentsLoading = ref(true);

const members = ref<Member[]>([]);
const membersLoading = ref(true);

/* =======================
   MODALS
======================= */

const showEditModal = ref(false);
const showAddCommentModal = ref(false);
const showAddAttachmentModal = ref(false);
const showChangeLeaderModal = ref(false);
const showAddMemberModal = ref(false);

/* =======================
   FORMS
======================= */

const newComment = ref("");
const commentLoading = ref(false);

const newAttachment = ref({
  name: "",
  url: "",
});
const attachmentLoading = ref(false);

/* =======================
   PERMISSIONS
======================= */

const canEditTask = computed(() => {
  if (!task.value || !authStore.user) return false;

  return (
    task.value.created_by === authStore.user.id ||
    task.value.leader_id === authStore.user.id ||
    authStore.profile?.role === "admin"
  );
});

/* =======================
   LIFECYCLE
======================= */

onMounted(async () => {
  await Promise.all([
    fetchTask(),
    fetchComments(),
    fetchAttachments(),
    fetchMembers(),
  ]);
});

/* =======================
   FETCH TASK
======================= */

async function fetchTask() {
  try {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("tasks")
      .select(
        `
        *,
        project:projects!tasks_project_id_fkey(name),
        leader:users_profile!tasks_leader_id_fkey(name)
      `
      )
      .eq("id", taskId)
      .single();

    if (err) throw err;

    task.value = data
      ? {
          ...data,
          project_name: data.project?.name,
          leader_name: data.leader?.name,
        }
      : null;
  } catch (err: any) {
    console.error("Erro ao buscar tarefa:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

/* =======================
   COMMENTS (task_notes)
======================= */

async function fetchComments() {
  try {
    commentsLoading.value = true;

    const { data, error: err } = await supabase
      .from("task_notes")
      .select(
        `
        *,
        user:users_profile!task_notes_created_by_fkey(name)
      `
      )
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (err) throw err;

    comments.value = (data || []).map((note) => ({
      ...note,
      content: note.text,
      user_name: note.user?.name,
    }));
  } catch (err) {
    console.error("Erro ao buscar comentários:", err);
  } finally {
    commentsLoading.value = false;
  }
}

async function addComment() {
  if (!authStore.user) return;

  try {
    commentLoading.value = true;

    await supabase.from("task_notes").insert({
      task_id: taskId,
      created_by: authStore.user.id,
      text: newComment.value,
    });

    newComment.value = "";
    showAddCommentModal.value = false;

    await fetchComments();
    window.notify.success("Comentário adicionado com sucesso");
  } catch (err: any) {
    window.notify.error("Erro ao adicionar comentário", err.message);
  } finally {
    commentLoading.value = false;
  }
}

async function deleteComment(commentId: string) {
  if (!confirm("Deseja excluir este comentário?")) return;

  await supabase.from("task_notes").delete().eq("id", commentId);
  comments.value = comments.value.filter((c) => c.id !== commentId);
}

/* =======================
   ATTACHMENTS
======================= */

async function fetchAttachments() {
  try {
    attachmentsLoading.value = true;

    const { data, error: err } = await supabase
      .from("attachments")
      .select(
        `
        *,
        user:users_profile!attachments_uploaded_by_fkey(name)
      `
      )
      .eq("related_type", "task")
      .eq("related_id", taskId)
      .order("created_at", { ascending: false });

    if (err) throw err;

    attachments.value = (data || []).map((a) => ({
      ...a,
      name: a.title,
      user_name: a.user?.name,
    }));
  } catch (err) {
    console.error("Erro ao buscar anexos:", err);
  } finally {
    attachmentsLoading.value = false;
  }
}

async function addAttachment() {
  if (!authStore.user) return;

  try {
    attachmentLoading.value = true;

    await supabase.from("attachments").insert({
      related_type: "task",
      related_id: taskId,
      title: newAttachment.value.name,
      file_url: newAttachment.value.url,
      uploaded_by: authStore.user.id,
    });

    newAttachment.value = { name: "", url: "" };
    showAddAttachmentModal.value = false;

    await fetchAttachments();
    window.notify.success("Anexo adicionado com sucesso");
  } finally {
    attachmentLoading.value = false;
  }
}

async function deleteAttachment(id: string) {
  if (!confirm("Excluir este anexo?")) return;

  await supabase.from("attachments").delete().eq("id", id);
  attachments.value = attachments.value.filter((a) => a.id !== id);
}

/* =======================
   MEMBERS
======================= */

async function fetchMembers() {
  try {
    membersLoading.value = true;

    const { data, error: err } = await supabase
      .from("task_members")
      .select(
        `
        id,
        user_id,
        user:users_profile!task_members_user_id_fkey(name)
      `
      )
      .eq("task_id", taskId);

    if (err) throw err;

    members.value = (data || []).map((m) => ({
      id: m.id,
      user_id: m.user_id,
      name: m.user?.name || "Usuário",
    }));
  } finally {
    membersLoading.value = false;
  }
}

/* =======================
   HELPERS
======================= */

function formatDate(date: string) {
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
}

function formatRelativeTime(date: string) {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale: ptBR,
  });
}

function isOverdue(date: string) {
  return isPast(parseISO(date));
}

function getInitials(name: string) {
  const parts = name.split(" ");
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts.at(-1)![0]).toUpperCase();
}
</script>
