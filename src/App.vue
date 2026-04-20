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
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // Clipboard API unavailable — URL is visible in address bar
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="h-screen flex flex-col bg-cream overflow-hidden">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-terra text-white px-4 py-2 rounded-lg z-50 text-sm font-medium">
      Skip to content
    </a>

    <!-- Header -->
    <header class="bg-cream border-b border-cream-border flex-shrink-0 z-10">
      <div class="px-5 py-3 flex items-center justify-between gap-4">
        <h1 class="font-display text-2xl font-semibold text-ink tracking-tight leading-none">
          <span class="text-terra" aria-hidden="true">✦</span>&#8201;PocketWish
        </h1>

        <div class="flex items-center gap-2">
          <!-- Settings -->
          <div class="relative">
            <button
              @click="showSettings = !showSettings"
              class="p-2 text-ink-subtle hover:text-ink-muted rounded-lg hover:bg-cream-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
              aria-label="Settings"
              :aria-expanded="showSettings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <div v-if="showSettings" @click="showSettings = false" class="fixed inset-0 z-10" aria-hidden="true" />

            <div
              v-if="showSettings"
              class="absolute right-0 top-full mt-2 bg-cream border border-cream-border rounded-2xl shadow-lg p-4 w-56 z-20 space-y-4"
              role="dialog"
              aria-label="Feature settings"
            >
              <p class="text-[10px] font-semibold text-ink-subtle uppercase tracking-widest">Features</p>

              <div class="flex items-center justify-between gap-3">
                <label for="feature-links" class="text-sm text-ink-muted cursor-pointer select-none">Links</label>
                <button
                  id="feature-links"
                  role="switch"
                  :aria-checked="features.links"
                  @click="features.links = !features.links"
                  class="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
                  :class="features.links ? 'bg-terra' : 'bg-cream-border'"
                >
                  <span
                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200"
                    :class="features.links ? 'translate-x-4' : 'translate-x-0.5'"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between gap-3">
                <label for="feature-priority" class="text-sm text-ink-muted cursor-pointer select-none">Priority</label>
                <button
                  id="feature-priority"
                  role="switch"
                  :aria-checked="features.priority"
                  @click="features.priority = !features.priority"
                  class="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
                  :class="features.priority ? 'bg-terra' : 'bg-cream-border'"
                >
                  <span
                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200"
                    :class="features.priority ? 'translate-x-4' : 'translate-x-0.5'"
                  />
                </button>
              </div>

              <div v-if="features.links || features.priority" class="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xs text-amber-700 leading-snug">These options increase the size of the shared URL.</p>
              </div>
            </div>
          </div>

          <!-- Share button -->
          <button
            v-if="wishlists.length > 0"
            @click="copyUrl"
            class="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra flex-shrink-0"
            :class="copied ? 'bg-emerald-500 text-white' : 'bg-terra text-white hover:bg-terra-deep'"
            :aria-label="copied ? 'Link copied to clipboard' : 'Copy share link'"
          >
            <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ copied ? 'Copied!' : 'Share' }}</span>
          </button>
          <span class="sr-only" aria-live="polite" aria-atomic="true">{{ copied ? 'Link copied to clipboard' : '' }}</span>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main id="main-content" class="flex-1 flex overflow-hidden">

      <!-- Mobile layout -->
      <div class="flex-1 overflow-y-auto md:hidden bg-cream">
        <div class="max-w-2xl mx-auto px-4 py-6">
          <!-- Empty state -->
          <div v-if="wishlists.length === 0 && !showAddForm" class="text-center py-16 px-4">
            <p class="font-display text-6xl font-light text-terra mb-4 leading-none opacity-20" aria-hidden="true">✦</p>
            <h2 class="font-display text-2xl font-medium text-ink mb-2">No wishlists yet</h2>
            <p class="text-sm text-ink-muted leading-relaxed">Create your first wishlist and share it with anyone via URL — no account needed.</p>
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

          <!-- Add wishlist form (mobile) -->
          <div v-if="showAddForm" class="mt-4">
            <form
              @submit.prevent="handleAddWishlist"
              class="bg-white rounded-2xl border border-cream-border p-4 shadow-sm"
              aria-label="Create a new wishlist"
            >
              <label for="new-wishlist-name-mobile" class="block text-xs font-medium text-ink-subtle uppercase tracking-wide mb-1.5">
                Wishlist name <span aria-hidden="true">*</span><span class="sr-only">(required)</span>
              </label>
              <input
                id="new-wishlist-name-mobile"
                ref="addInput"
                v-model="newWishlistName"
                type="text"
                required
                placeholder="e.g. Birthday, Christmas…"
                class="w-full px-3 py-2.5 border border-cream-border rounded-xl text-sm bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra transition-colors placeholder:text-ink-subtle"
              />
              <div class="flex gap-2 mt-3">
                <button type="submit" class="flex-1 py-2.5 px-4 bg-terra text-white text-sm font-medium rounded-xl hover:bg-terra-deep transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terra">
                  Create
                </button>
                <button type="button" @click="cancelAdd" class="py-2.5 px-4 text-ink-muted text-sm font-medium rounded-xl border border-cream-border hover:bg-cream-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-subtle">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Add wishlist button (mobile) -->
          <button
            v-if="!showAddForm"
            @click="openAddForm"
            class="mt-4 w-full py-3 rounded-2xl text-terra text-sm font-medium hover:bg-terra-pale transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra border-2 border-dashed border-cream-border hover:border-terra"
            aria-label="Add a new wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New wishlist
          </button>
        </div>
      </div>

      <!-- Desktop Sidebar -->
      <nav
        aria-label="Wishlists"
        class="hidden md:flex flex-col w-60 bg-cream-muted border-r border-cream-border overflow-hidden flex-shrink-0"
      >
        <!-- New wishlist (top) -->
        <div class="flex-shrink-0 border-b border-cream-border p-3">
          <form v-if="showAddForm" @submit.prevent="handleAddWishlist" aria-label="Create a new wishlist" class="space-y-2">
            <input
              ref="addInput"
              v-model="newWishlistName"
              type="text"
              required
              placeholder="Wishlist name…"
              class="w-full px-3 py-2 border border-cream-border rounded-xl text-sm bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra transition-colors placeholder:text-ink-subtle"
              aria-label="New wishlist name"
            />
            <div class="flex gap-2">
              <button type="submit" class="flex-1 py-1.5 px-3 bg-terra text-white text-xs font-medium rounded-lg hover:bg-terra-deep transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terra">
                Create
              </button>
              <button type="button" @click="cancelAdd" class="py-1.5 px-3 text-ink-muted text-xs font-medium rounded-lg border border-cream-border hover:bg-cream transition-colors">
                Cancel
              </button>
            </div>
          </form>
          <button
            v-else
            @click="openAddForm"
            class="w-full py-2 text-sm text-terra font-medium hover:text-terra-deep flex items-center justify-center gap-1.5 rounded-xl hover:bg-terra-pale transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
            aria-label="Add a new wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New wishlist
          </button>
        </div>

        <!-- Wishlist nav list -->
        <div class="flex-1 overflow-y-auto py-2 px-2">
          <p v-if="wishlists.length === 0" class="text-xs text-ink-subtle px-3 py-4 text-center">
            No wishlists yet.
          </p>
          <button
            v-for="wl in wishlists"
            :key="wl.id"
            @click="selectedId = wl.id"
            class="w-full text-left px-3 py-2.5 rounded-r-xl mb-0.5 text-sm flex items-center gap-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra border-l-2"
            :class="selectedId === wl.id
              ? 'bg-cream border-terra text-ink font-medium shadow-sm'
              : 'border-transparent text-ink-muted hover:bg-cream hover:text-ink font-normal'"
            :aria-current="selectedId === wl.id ? 'page' : undefined"
          >
            <span class="flex-1 truncate">{{ wl.name }}</span>
            <span
              class="text-xs tabular-nums flex-shrink-0"
              :class="selectedId === wl.id ? 'text-terra' : 'text-ink-subtle'"
            >
              {{ wl.wishes.length }}
            </span>
          </button>
        </div>
      </nav>

      <!-- Desktop content panel -->
      <div class="hidden md:flex flex-1 overflow-y-auto bg-cream">
        <div class="w-full max-w-2xl mx-auto p-8">
          <!-- No wishlists -->
          <div v-if="wishlists.length === 0" class="text-center py-20 px-4">
            <p class="font-display text-8xl font-light text-terra opacity-20 leading-none mb-6" aria-hidden="true">✦</p>
            <h2 class="font-display text-4xl font-medium text-ink mb-3">Your lists await.</h2>
            <p class="text-sm text-ink-muted leading-relaxed">Create a wishlist using the sidebar and share it with anyone.</p>
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
