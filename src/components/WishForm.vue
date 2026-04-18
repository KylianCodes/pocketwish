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
      <label :for="`${formId}-name`" class="block text-xs font-medium text-gray-600 mb-1">
        Name <span aria-hidden="true">*</span><span class="sr-only">(required)</span>
      </label>
      <input
        :id="`${formId}-name`"
        v-model="name"
        type="text"
        required
        autofocus
        placeholder="What do you wish for?"
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
      />
    </div>

    <div v-if="features.links">
      <label :for="`${formId}-link`" class="block text-xs font-medium text-gray-600 mb-1">
        Link <span class="text-gray-400">(optional)</span>
      </label>
      <input
        :id="`${formId}-link`"
        v-model="link"
        type="url"
        placeholder="https://..."
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
      />
    </div>

    <div v-if="features.priority">
      <label :for="`${formId}-priority`" class="block text-xs font-medium text-gray-600 mb-1">
        Priority <span class="text-gray-400">(optional)</span>
      </label>
      <select
        :id="`${formId}-priority`"
        v-model="priority"
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
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
        class="flex-1 py-2 px-4 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
      >
        Add wish
      </button>
      <button
        type="button"
        @click="emit('cancel')"
        class="py-2 px-4 text-gray-600 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
