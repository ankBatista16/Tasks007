<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-surface rounded-lg p-6 w-full max-w-lg">
      <h2 class="text-lg font-semibold mb-4">Nova Tarefa</h2>

      <form @submit.prevent="createTask" class="space-y-4">
        <input
          v-model="form.title"
          required
          placeholder="Título da tarefa"
          class="input"
        />

        <textarea
          v-model="form.description"
          placeholder="Descrição"
          class="input"
        />

        <input v-model="form.due_date" type="date" class="input" />

        <select v-model="form.status" class="input">
          <option value="pendente">Pendente</option>
          <option value="em andamento">Em andamento</option>
          <option value="concluída">Concluída</option>
        </select>

        <select v-model="form.leader_id" class="input">
          <option value="">Sem responsável</option>
          <option
            v-for="member in members"
            :key="member.user_id"
            :value="member.user_id"
          >
            {{ member.name }}
          </option>
        </select>

        <div class="flex justify-end gap-3">
          <button type="button" class="btn-secondary" @click="$emit('close')">
            Cancelar
          </button>

          <button type="submit" class="btn-primary">Criar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import { useAuthStore } from "@/stores/auth";

const props = defineProps<{
  projectId: string;
}>();

const emit = defineEmits(["close", "created"]);

const authStore = useAuthStore();

const form = ref({
  title: "",
  description: "",
  due_date: "",
  status: "pendente",
  leader_id: "",
});

const members = ref<{ user_id: string; name: string }[]>([]);

onMounted(fetchMembers);

async function fetchMembers() {
  const { data } = await supabase
    .from("project_members")
    .select(`user_id, user:users_profile(name)`)
    .eq("project_id", props.projectId);

  members.value =
    data?.map((m) => ({
      user_id: m.user_id,
      name: m.user?.name ?? "Usuário",
    })) ?? [];
}

async function createTask() {
  if (!authStore.user) return;

  const { error } = await supabase.from("tasks").insert({
    project_id: props.projectId,
    title: form.value.title,
    description: form.value.description || null,
    due_date: form.value.due_date || null,
    status: form.value.status,
    leader_id: form.value.leader_id || null,
    created_by: authStore.user.id,
  });

  if (!error) {
    emit("created");
    emit("close");
  }
}
</script>
