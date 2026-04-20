<script setup>
import { ref, nextTick } from 'vue'
import WishItem from './WishItem.vue'
import WishForm from './WishForm.vue'

const props = defineProps({
  wishlist: { type: Object, required: true },
  alwaysOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['rename', 'remove', 'add-wish', 'remove-wish', 'edit-wish'])

const isOpen = ref(false)
const isRenaming = ref(false)
const renameValue = ref('')
const renameInput = ref(null)
const showWishForm = ref(false)
const editingWishId = ref(null)

const panelId = `panel-${props.wishlist.id}`
const headerId = `header-${props.wishlist.id}`

async function startRename() {
  renameValue.value = props.wishlist.name
  isRenaming.value = true
  await nextTick()
  renameInput.value?.focus()
  renameInput.value?.select()
}

function confirmRename() {
  const name = renameValue.value.trim()
  if (name && name !== props.wishlist.name) {
    emit('rename', props.wishlist.id, name)
  }
  isRenaming.value = false
}

function handleRenameKeydown(e) {
  if (e.key === 'Escape') isRenaming.value = false
}

function handleRemove() {
  if (confirm(`Delete "${props.wishlist.name}"? This cannot be undone.`)) {
    emit('remove', props.wishlist.id)
  }
}

function handleAddWish(wish) {
  emit('add-wish', props.wishlist.id, wish)
  showWishForm.value = false
}

function handleEditWish(wishId, updates) {
  emit('edit-wish', props.wishlist.id, wishId, updates)
  editingWishId.value = null
}

function handleRemoveWish(wishId) {
  emit('remove-wish', props.wishlist.id, wishId)
}
</script>

<template>
  <article class="bg-white rounded-2xl shadow-sm border border-cream-border overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-1 px-4 py-4">

      <!-- Accordion toggle (mobile / non-alwaysOpen, not renaming) -->
      <button
        v-if="!alwaysOpen && !isRenaming"
        :id="headerId"
        :aria-expanded="isOpen"
        :aria-controls="panelId"
        @click="isOpen = !isOpen"
        class="flex-1 flex items-center gap-2.5 text-left min-w-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-terra py-0.5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-ink-subtle flex-shrink-0 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
        </svg>
        <span class="font-display text-xl font-semibold text-ink truncate leading-tight">{{ wishlist.name }}</span>
        <span
          class="flex-shrink-0 text-xs font-medium text-terra bg-terra-pale px-2 py-0.5 rounded-full tabular-nums"
          aria-hidden="true"
        >
          {{ wishlist.wishes.length }}
        </span>
      </button>

      <!-- Static name (alwaysOpen mode, not renaming) -->
      <div
        v-else-if="alwaysOpen && !isRenaming"
        :id="headerId"
        class="flex-1 flex items-center gap-3 min-w-0 py-0.5"
      >
        <h2 class="font-display text-3xl font-semibold text-ink leading-tight truncate">{{ wishlist.name }}</h2>
        <span
          class="flex-shrink-0 text-xs font-medium text-terra bg-terra-pale px-2 py-0.5 rounded-full tabular-nums"
          aria-hidden="true"
        >
          {{ wishlist.wishes.length }}
        </span>
      </div>

      <!-- Rename input (any mode, while renaming) -->
      <input
        v-if="isRenaming"
        ref="renameInput"
        v-model="renameValue"
        type="text"
        :aria-label="`Rename wishlist, currently named ${wishlist.name}`"
        class="flex-1 text-sm font-semibold border-b-2 border-terra focus:outline-none bg-transparent py-0.5 min-w-0 text-ink"
        @blur="confirmRename"
        @keydown.enter.prevent="confirmRename"
        @keydown="handleRenameKeydown"
      />

      <button
        v-if="!isRenaming"
        @click="startRename"
        class="p-2 text-ink-subtle hover:text-ink-muted rounded-lg hover:bg-cream-muted transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
        :aria-label="`Rename ${wishlist.name}`"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      <button
        v-if="!isRenaming"
        @click="handleRemove"
        class="p-2 text-ink-subtle hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        :aria-label="`Delete ${wishlist.name}`"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Panel -->
    <div
      v-show="alwaysOpen || isOpen"
      :id="panelId"
      role="region"
      :aria-labelledby="headerId"
    >
      <div v-if="wishlist.wishes.length === 0 && !showWishForm" class="px-4 py-8 text-center border-t border-cream-border">
        <p class="text-sm text-ink-subtle">No wishes yet.</p>
      </div>

      <ul
        v-if="wishlist.wishes.length > 0"
        class="divide-y divide-cream-border border-t border-cream-border"
        role="list"
        :aria-label="`Wishes in ${wishlist.name}`"
      >
        <li v-for="wish in wishlist.wishes" :key="wish.id">
          <WishItem
            :wish="wish"
            :editing="editingWishId === wish.id"
            @edit="editingWishId = wish.id"
            @cancel-edit="editingWishId = null"
            @save="(updates) => handleEditWish(wish.id, updates)"
            @remove="handleRemoveWish(wish.id)"
          />
        </li>
      </ul>

      <div v-if="showWishForm" class="px-4 py-4 border-t border-cream-border bg-cream">
        <WishForm
          :form-id="`add-wish-${wishlist.id}`"
          @submit="handleAddWish"
          @cancel="showWishForm = false"
        />
      </div>

      <div v-if="!showWishForm" class="border-t border-cream-border">
        <button
          @click="showWishForm = true"
          class="w-full py-3 flex items-center justify-center gap-1.5 text-sm text-terra font-medium hover:text-terra-deep hover:bg-terra-pale transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terra rounded-b-2xl"
          :aria-label="`Add a wish to ${wishlist.name}`"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add a wish
        </button>
      </div>
    </div>
  </article>
</template>
