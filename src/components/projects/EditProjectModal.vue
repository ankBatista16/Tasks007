<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-surface rounded-lg p-6 w-full max-w-lg">
      <h2 class="text-lg font-semibold mb-4">Editar Projeto</h2>

      <form @submit.prevent="save" class="space-y-4">
        <input v-model="form.name" class="input" required />

        <textarea v-model="form.description" class="input" />

        <input type="date" v-model="form.start_date" class="input" />
        <input type="date" v-model="form.end_date" class="input" />

        <select v-model="form.status" class="input">
          <option value="planejado">Planejado</option>
          <option value="em andamento">Em andamento</option>
          <option value="concluído">Concluído</option>
        </select>

        <div class="flex justify-end gap-3">
          <button type="button" class="btn-secondary" @click="$emit('close')">
            Cancelar
          </button>
          <button class="btn-primary">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "@/supabase";

const props = defineProps<{ project: any }>();
const emit = defineEmits(["close", "updated"]);

const form = ref({ ...props.project });

async function save() {
  const { error } = await supabase
    .from("projects")
    .update({
      name: form.value.name,
      description: form.value.description,
      start_date: form.value.start_date,
      end_date: form.value.end_date,
      status: form.value.status,
    })
    .eq("id", form.value.id);

  if (!error) {
    emit("updated");
    emit("close");
  }
}
</script>
