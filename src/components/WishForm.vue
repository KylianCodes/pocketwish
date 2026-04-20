<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
  formId: { type: String, required: true },
})

const emit = defineEmits(['submit', 'cancel'])

const features = inject('features', ref({ links: false, priority: false }))

const name = ref('')
const link = ref('')
const priority = ref('')

function handleSubmit() {
  const trimmedName = name.value.trim()
  if (!trimmedName) return
  emit('submit', {
    name: trimmedName,
    link: features.value.links ? link.value.trim() : '',
    priority: features.value.priority ? priority.value : '',
  })
  name.value = ''
  link.value = ''
  priority.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-3" aria-label="Add a new wish">
    <div>
      <label :for="`${formId}-name`" class="block text-xs font-medium text-ink-subtle uppercase tracking-wide mb-1">
        Name <span aria-hidden="true">*</span><span class="sr-only">(required)</span>
      </label>
      <input
        :id="`${formId}-name`"
        v-model="name"
        type="text"
        required
        autofocus
        placeholder="What do you wish for?"
        class="w-full px-3 py-2.5 text-sm border border-cream-border rounded-xl bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra transition-colors placeholder:text-ink-subtle"
      />
    </div>

    <div v-if="features.links">
      <label :for="`${formId}-link`" class="block text-xs font-medium text-ink-subtle uppercase tracking-wide mb-1">
        Link <span class="normal-case text-ink-subtle">(optional)</span>
      </label>
      <input
        :id="`${formId}-link`"
        v-model="link"
        type="url"
        placeholder="https://…"
        class="w-full px-3 py-2.5 text-sm border border-cream-border rounded-xl bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra transition-colors placeholder:text-ink-subtle"
      />
    </div>

    <div v-if="features.priority">
      <label :for="`${formId}-priority`" class="block text-xs font-medium text-ink-subtle uppercase tracking-wide mb-1">
        Priority <span class="normal-case text-ink-subtle">(optional)</span>
      </label>
      <select
        :id="`${formId}-priority`"
        v-model="priority"
        class="w-full px-3 py-2.5 text-sm border border-cream-border rounded-xl bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra transition-colors"
      >
        <option value="">No priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>

    <div class="flex gap-2 pt-1">
      <button
        type="submit"
        class="flex-1 py-2.5 px-4 bg-terra text-white text-sm font-medium rounded-xl hover:bg-terra-deep transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
      >
        Add wish
      </button>
      <button
        type="button"
        @click="emit('cancel')"
        class="py-2.5 px-4 text-ink-muted text-sm font-medium rounded-xl border border-cream-border hover:bg-cream-muted transition-colors"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
