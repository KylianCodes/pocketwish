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
  <article class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-1 px-3 py-3">

      <!-- Accordion toggle (mobile / non-alwaysOpen, not renaming) -->
      <button
        v-if="!alwaysOpen && !isRenaming"
        :id="headerId"
        :aria-expanded="isOpen"
        :aria-controls="panelId"
        @click="isOpen = !isOpen"
        class="flex-1 flex items-center gap-2.5 text-left min-w-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 py-0.5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
        <span class="font-semibold text-gray-900 truncate text-sm">{{ wishlist.name }}</span>
        <span
          class="ml-auto flex-shrink-0 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full tabular-nums"
          aria-hidden="true"
        >
          {{ wishlist.wishes.length }}
        </span>
      </button>

      <!-- Static name (alwaysOpen mode, not renaming) -->
      <div
        v-else-if="alwaysOpen && !isRenaming"
        :id="headerId"
        class="flex-1 flex items-center gap-2.5 min-w-0 py-0.5"
      >
        <span class="font-semibold text-gray-900 truncate text-sm">{{ wishlist.name }}</span>
        <span
          class="ml-auto flex-shrink-0 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full tabular-nums"
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
        class="flex-1 text-sm font-semibold border-b-2 border-violet-500 focus:outline-none bg-transparent py-0.5 min-w-0"
        @blur="confirmRename"
        @keydown.enter.prevent="confirmRename"
        @keydown="handleRenameKeydown"
      />

      <button
        v-if="!isRenaming"
        @click="startRename"
        class="p-2 text-gray-400 hover:text-violet-600 rounded-lg hover:bg-violet-50 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        :aria-label="`Rename ${wishlist.name}`"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      <button
        v-if="!isRenaming"
        @click="handleRemove"
        class="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        :aria-label="`Delete ${wishlist.name}`"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Panel (always visible in alwaysOpen mode) -->
    <div
      v-show="alwaysOpen || isOpen"
      :id="panelId"
      role="region"
      :aria-labelledby="headerId"
    >
      <div v-if="wishlist.wishes.length === 0 && !showWishForm" class="px-4 py-6 text-center border-t border-gray-100">
        <p class="text-sm text-gray-400">No wishes yet.</p>
      </div>

      <ul
        v-if="wishlist.wishes.length > 0"
        class="divide-y divide-gray-50 border-t border-gray-100"
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

      <div v-if="showWishForm" class="px-4 py-3 border-t border-gray-100">
        <WishForm
          :form-id="`add-wish-${wishlist.id}`"
          @submit="handleAddWish"
          @cancel="showWishForm = false"
        />
      </div>

      <div v-if="!showWishForm" class="px-4 py-2.5 border-t border-gray-100">
        <button
          @click="showWishForm = true"
          class="w-full py-2 text-sm text-violet-600 hover:text-violet-700 flex items-center justify-center gap-1.5 rounded-lg hover:bg-violet-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          :aria-label="`Add a wish to ${wishlist.name}`"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add a wish
        </button>
      </div>
    </div>
  </article>
</template>
