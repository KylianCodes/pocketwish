<script setup>
import { ref, computed, watch, nextTick, provide } from 'vue'
import { useWishlists } from './composables/useWishlists.js'
import { useFeatures } from './composables/useFeatures.js'
import WishList from './components/WishList.vue'

const { wishlists, addWishlist, removeWishlist, renameWishlist, addWish, removeWish, editWish } = useWishlists()
const { features } = useFeatures()
provide('features', features)

const showAddForm = ref(false)
const newWishlistName = ref('')
const addInput = ref(null)
const copied = ref(false)
const showSettings = ref(false)

// Desktop: selected wishlist
const selectedId = ref(wishlists.value[0]?.id ?? null)
const selectedWishlist = computed(() => wishlists.value.find(wl => wl.id === selectedId.value) ?? null)

watch(wishlists, (wls) => {
  if (!wls.find(wl => wl.id === selectedId.value)) {
    selectedId.value = wls[0]?.id ?? null
  }
}, { deep: true })

async function openAddForm() {
  showAddForm.value = true
  await nextTick()
  addInput.value?.focus()
}

function handleAddWishlist() {
  const name = newWishlistName.value.trim()
  if (!name) return
  addWishlist(name)
  newWishlistName.value = ''
  showAddForm.value = false
  nextTick(() => {
    const last = wishlists.value[wishlists.value.length - 1]
    if (last) selectedId.value = last.id
  })
}

function cancelAdd() {
  showAddForm.value = false
  newWishlistName.value = ''
}

async function copyUrl() {
  const url = window.location.href
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url)
  } else {
    const el = document.createElement('input')
    el.value = url
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50 overflow-hidden">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-violet-600 text-white px-4 py-2 rounded-lg z-50 text-sm font-medium">
      Skip to content
    </a>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 flex-shrink-0 z-10">
      <div class="px-4 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-violet-700 tracking-tight leading-none">PocketWish</h1>
          <p class="text-xs text-gray-500 mt-1">Share your wishlists via URL</p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Settings -->
          <div class="relative">
            <button
              @click="showSettings = !showSettings"
              class="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="Settings"
              :aria-expanded="showSettings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <!-- Transparent overlay to close settings -->
            <div v-if="showSettings" @click="showSettings = false" class="fixed inset-0 z-10" aria-hidden="true" />

            <!-- Settings dropdown -->
            <div
              v-if="showSettings"
              class="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-56 z-20 space-y-4"
              role="dialog"
              aria-label="Feature settings"
            >
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Features</p>

              <div class="flex items-center justify-between gap-3">
                <label for="feature-links" class="text-sm text-gray-700 cursor-pointer select-none">Links</label>
                <button
                  id="feature-links"
                  role="switch"
                  :aria-checked="features.links"
                  @click="features.links = !features.links"
                  class="relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  :class="features.links ? 'bg-violet-600' : 'bg-gray-200'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-150"
                    :class="features.links ? 'translate-x-5' : 'translate-x-1'"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between gap-3">
                <label for="feature-priority" class="text-sm text-gray-700 cursor-pointer select-none">Priority</label>
                <button
                  id="feature-priority"
                  role="switch"
                  :aria-checked="features.priority"
                  @click="features.priority = !features.priority"
                  class="relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  :class="features.priority ? 'bg-violet-600' : 'bg-gray-200'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-150"
                    :class="features.priority ? 'translate-x-5' : 'translate-x-1'"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Share button -->
          <button
            v-if="wishlists.length > 0"
            @click="copyUrl"
            class="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 flex-shrink-0"
            :aria-label="copied ? 'Link copied to clipboard' : 'Copy share link'"
            :aria-live="copied ? 'polite' : undefined"
          >
            <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ copied ? 'Copied!' : 'Share' }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main id="main-content" class="flex-1 flex overflow-hidden">

      <!-- Mobile layout -->
      <div class="flex-1 overflow-y-auto md:hidden">
        <div class="max-w-2xl mx-auto px-4 py-6">
          <!-- Empty state -->
          <div v-if="wishlists.length === 0 && !showAddForm" class="text-center py-16 px-4">
            <p class="text-4xl mb-4" aria-hidden="true">🎁</p>
            <h2 class="text-lg font-semibold text-gray-800 mb-2">No wishlists yet</h2>
            <p class="text-sm text-gray-500">Create your first wishlist and share it with anyone via URL — no account needed.</p>
          </div>

          <!-- Wishlists -->
          <div v-if="wishlists.length > 0" class="space-y-3 mb-4">
            <WishList
              v-for="wl in wishlists"
              :key="wl.id"
              :wishlist="wl"
              @rename="(id, name) => renameWishlist(id, name)"
              @remove="(id) => removeWishlist(id)"
              @add-wish="(wishlistId, wish) => addWish(wishlistId, wish)"
              @remove-wish="(wishlistId, wishId) => removeWish(wishlistId, wishId)"
              @edit-wish="(wishlistId, wishId, updates) => editWish(wishlistId, wishId, updates)"
            />
          </div>

          <!-- Add wishlist form -->
          <div v-if="showAddForm" class="mt-4">
            <form
              @submit.prevent="handleAddWishlist"
              class="bg-white rounded-xl border border-violet-200 p-4 shadow-sm"
              aria-label="Create a new wishlist"
            >
              <label for="new-wishlist-name-mobile" class="block text-sm font-medium text-gray-700 mb-2">
                Wishlist name <span aria-hidden="true">*</span><span class="sr-only">(required)</span>
              </label>
              <input
                id="new-wishlist-name-mobile"
                ref="addInput"
                v-model="newWishlistName"
                type="text"
                required
                placeholder="e.g. Birthday, Christmas…"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <div class="flex gap-2 mt-3">
                <button type="submit" class="flex-1 py-2 px-4 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                  Create
                </button>
                <button type="button" @click="cancelAdd" class="py-2 px-4 text-gray-600 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Add wishlist button -->
          <button
            v-if="!showAddForm"
            @click="openAddForm"
            class="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm hover:border-violet-400 hover:text-violet-600 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            aria-label="Add a new wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add a wishlist
          </button>
        </div>
      </div>

      <!-- Desktop layout -->
      <!-- Sidebar -->
      <nav
        aria-label="Wishlists"
        class="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 overflow-hidden flex-shrink-0"
      >
        <div class="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p v-if="wishlists.length === 0" class="text-xs text-gray-400 px-3 py-3 text-center">
            No wishlists yet.
          </p>
          <button
            v-for="wl in wishlists"
            :key="wl.id"
            @click="selectedId = wl.id"
            class="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            :class="selectedId === wl.id
              ? 'bg-violet-50 text-violet-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            :aria-current="selectedId === wl.id ? 'page' : undefined"
          >
            <span class="flex-1 truncate">{{ wl.name }}</span>
            <span
              class="text-xs tabular-nums flex-shrink-0"
              :class="selectedId === wl.id ? 'text-violet-400' : 'text-gray-400'"
            >
              {{ wl.wishes.length }}
            </span>
          </button>
        </div>

        <!-- Add wishlist (bottom of sidebar) -->
        <div class="flex-shrink-0 border-t border-gray-200 p-3">
          <form v-if="showAddForm" @submit.prevent="handleAddWishlist" aria-label="Create a new wishlist" class="space-y-2">
            <input
              ref="addInput"
              v-model="newWishlistName"
              type="text"
              required
              placeholder="Wishlist name…"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              aria-label="New wishlist name"
            />
            <div class="flex gap-2">
              <button type="submit" class="flex-1 py-1.5 px-3 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors">
                Create
              </button>
              <button type="button" @click="cancelAdd" class="py-1.5 px-3 text-gray-600 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
          <button
            v-else
            @click="openAddForm"
            class="w-full py-2 text-sm text-violet-600 hover:text-violet-700 flex items-center justify-center gap-1.5 rounded-lg hover:bg-violet-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            aria-label="Add a new wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New wishlist
          </button>
        </div>
      </nav>

      <!-- Desktop content panel -->
      <div class="hidden md:flex flex-1 overflow-y-auto">
        <div class="w-full max-w-2xl mx-auto p-6">
          <!-- No wishlists -->
          <div v-if="wishlists.length === 0" class="text-center py-16 px-4">
            <p class="text-4xl mb-4" aria-hidden="true">🎁</p>
            <h2 class="text-lg font-semibold text-gray-800 mb-2">No wishlists yet</h2>
            <p class="text-sm text-gray-500">Create your first wishlist using the sidebar.</p>
          </div>

          <!-- Selected wishlist -->
          <WishList
            v-else-if="selectedWishlist"
            :wishlist="selectedWishlist"
            :always-open="true"
            @rename="(id, name) => renameWishlist(id, name)"
            @remove="(id) => removeWishlist(id)"
            @add-wish="(wishlistId, wish) => addWish(wishlistId, wish)"
            @remove-wish="(wishlistId, wishId) => removeWish(wishlistId, wishId)"
            @edit-wish="(wishlistId, wishId, updates) => editWish(wishlistId, wishId, updates)"
          />
        </div>
      </div>
    </main>
  </div>
</template>
