<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-surface rounded-lg p-6 w-full max-w-md">
      <h2 class="text-lg font-semibold mb-4">Adicionar Membro</h2>

      <form @submit.prevent="addMember" class="space-y-4">
        <select v-model="userId" class="input" required>
          <option value="">Selecione um usuário</option>
          <option v-for="u in users" :key="u.id" :value="u.id">
            {{ u.name }}
          </option>
        </select>

        <div class="flex justify-end gap-3">
          <button type="button" class="btn-secondary" @click="$emit('close')">
            Cancelar
          </button>

          <button class="btn-primary">Adicionar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";

const props = defineProps<{ projectId: string }>();
const emit = defineEmits(["close", "added"]);

const users = ref<{ id: string; name: string }[]>([]);
const userId = ref("");

onMounted(fetchUsers);

async function fetchUsers() {
  const { data } = await supabase.from("users_profile").select("id, name");
  users.value = data ?? [];
}

async function addMember() {
  const { error } = await supabase.from("project_members").insert({
    project_id: props.projectId,
    user_id: userId.value,
  });

  if (!error) {
    emit("added");
    emit("close");
  }
}
</script>
