<script setup>
import { ref, watch, inject } from 'vue'

const props = defineProps({
  wish: { type: Object, required: true },
  editing: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'cancel-edit', 'save', 'remove'])

const features = inject('features', ref({ links: false, priority: false }))

const editName = ref(props.wish.name)
const editLink = ref(props.wish.link || '')
const editPriority = ref(props.wish.priority || '')

watch(() => props.wish, (w) => {
  editName.value = w.name
  editLink.value = w.link || ''
  editPriority.value = w.priority || ''
})

function save() {
  const name = editName.value.trim()
  if (!name) return
  emit('save', { name, link: editLink.value.trim(), priority: editPriority.value })
}

const priorityConfig = {
  high: { label: 'High', class: 'bg-red-100 text-red-700' },
  medium: { label: 'Medium', class: 'bg-amber-100 text-amber-700' },
  low: { label: 'Low', class: 'bg-green-100 text-green-700' },
}
</script>

<template>
  <div class="px-4 py-3">
    <!-- View mode: always show existing link/priority data regardless of features -->
    <div v-if="!editing" class="flex items-start gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <a
            v-if="wish.link"
            :href="wish.link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-medium text-violet-700 hover:text-violet-900 underline underline-offset-2"
            :aria-label="`${wish.name} (opens in new tab)`"
          >
            {{ wish.name }}
          </a>
          <span v-else class="text-sm font-medium text-gray-900">{{ wish.name }}</span>
          <span
            v-if="wish.priority && priorityConfig[wish.priority]"
            :class="priorityConfig[wish.priority].class"
            class="text-xs px-2 py-0.5 rounded-full font-medium"
          >
            {{ priorityConfig[wish.priority].label }}
          </span>
        </div>
      </div>

      <div class="flex gap-1 flex-shrink-0">
        <button
          @click="emit('edit')"
          class="p-1.5 text-gray-400 hover:text-violet-600 rounded hover:bg-violet-50 transition-colors"
          :aria-label="`Edit ${wish.name}`"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          @click="emit('remove')"
          class="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
          :aria-label="`Delete ${wish.name}`"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Edit mode: show link/priority fields if feature enabled OR data already exists -->
    <form v-else @submit.prevent="save" class="space-y-2" :aria-label="`Edit ${wish.name}`">
      <div>
        <label :for="`edit-name-${wish.id}`" class="block text-xs font-medium text-gray-600 mb-1">
          Name <span aria-hidden="true">*</span><span class="sr-only">(required)</span>
        </label>
        <input
          :id="`edit-name-${wish.id}`"
          v-model="editName"
          type="text"
          required
          autofocus
          class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>
      <div v-if="features.links || wish.link">
        <label :for="`edit-link-${wish.id}`" class="block text-xs font-medium text-gray-600 mb-1">
          Link <span class="text-gray-400">(optional)</span>
        </label>
        <input
          :id="`edit-link-${wish.id}`"
          v-model="editLink"
          type="url"
          placeholder="https://..."
          class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>
      <div v-if="features.priority || wish.priority">
        <label :for="`edit-priority-${wish.id}`" class="block text-xs font-medium text-gray-600 mb-1">
          Priority <span class="text-gray-400">(optional)</span>
        </label>
        <select
          :id="`edit-priority-${wish.id}`"
          v-model="editPriority"
          class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
        >
          <option value="">No priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div class="flex gap-2 pt-1">
        <button type="submit" class="flex-1 py-1.5 px-3 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors">
          Save
        </button>
        <button type="button" @click="emit('cancel-edit')" class="py-1.5 px-3 text-gray-600 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
