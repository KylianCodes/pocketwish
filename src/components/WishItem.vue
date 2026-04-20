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
}, { deep: true })

function isSafeUrl(url) {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

function save() {
  const name = editName.value.trim()
  if (!name) return
  emit('save', { name, link: editLink.value.trim(), priority: editPriority.value })
}

const priorityConfig = {
  high: { label: 'High', class: 'bg-amber-100 text-amber-700' },
  medium: { label: 'Medium', class: 'bg-sky-50 text-sky-700' },
  low: { label: 'Low', class: 'bg-emerald-50 text-emerald-700' },
}
</script>

<template>
  <div class="px-4 py-3">
    <!-- View mode -->
    <div v-if="!editing" class="group flex items-center gap-3">
      <div class="flex-1 min-w-0 flex items-center gap-2.5 flex-wrap">
        <a
          v-if="wish.link && isSafeUrl(wish.link)"
          :href="wish.link"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-ink hover:text-terra underline decoration-cream-border underline-offset-2 hover:decoration-terra transition-colors"
          :aria-label="`${wish.name} (opens in new tab)`"
        >
          {{ wish.name }}
        </a>
        <span v-else class="text-sm text-ink">{{ wish.name }}</span>
        <span
          v-if="wish.priority && priorityConfig[wish.priority]"
          :class="priorityConfig[wish.priority].class"
          class="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
        >
          {{ priorityConfig[wish.priority].label }}
        </span>
      </div>

      <div class="flex gap-0.5 flex-shrink-0 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity duration-150">
        <button
          @click="emit('edit')"
          class="p-1.5 text-ink-subtle hover:text-ink-muted rounded-lg hover:bg-cream-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
          :aria-label="`Edit ${wish.name}`"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          @click="emit('remove')"
          class="p-1.5 text-ink-subtle hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          :aria-label="`Delete ${wish.name}`"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Edit mode -->
    <form v-else @submit.prevent="save" class="space-y-2.5" :aria-label="`Edit ${wish.name}`">
      <div>
        <label :for="`edit-name-${wish.id}`" class="block text-xs font-medium text-ink-subtle uppercase tracking-wide mb-1">
          Name <span aria-hidden="true">*</span><span class="sr-only">(required)</span>
        </label>
        <input
          :id="`edit-name-${wish.id}`"
          v-model="editName"
          type="text"
          required
          autofocus
          class="w-full px-3 py-2 text-sm border border-cream-border rounded-xl bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra transition-colors placeholder:text-ink-subtle"
        />
      </div>
      <div v-if="features.links || wish.link">
        <label :for="`edit-link-${wish.id}`" class="block text-xs font-medium text-ink-subtle uppercase tracking-wide mb-1">
          Link <span class="normal-case text-ink-subtle">(optional)</span>
        </label>
        <input
          :id="`edit-link-${wish.id}`"
          v-model="editLink"
          type="url"
          placeholder="https://…"
          class="w-full px-3 py-2 text-sm border border-cream-border rounded-xl bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra transition-colors placeholder:text-ink-subtle"
        />
      </div>
      <div v-if="features.priority || wish.priority">
        <label :for="`edit-priority-${wish.id}`" class="block text-xs font-medium text-ink-subtle uppercase tracking-wide mb-1">
          Priority <span class="normal-case text-ink-subtle">(optional)</span>
        </label>
        <select
          :id="`edit-priority-${wish.id}`"
          v-model="editPriority"
          class="w-full px-3 py-2 text-sm border border-cream-border rounded-xl bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra transition-colors"
        >
          <option value="">No priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div class="flex gap-2 pt-1">
        <button type="submit" class="flex-1 py-2 px-3 bg-terra text-white text-xs font-medium rounded-xl hover:bg-terra-deep transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terra">
          Save
        </button>
        <button type="button" @click="emit('cancel-edit')" class="py-2 px-3 text-ink-muted text-xs font-medium rounded-xl border border-cream-border hover:bg-cream-muted transition-colors">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
