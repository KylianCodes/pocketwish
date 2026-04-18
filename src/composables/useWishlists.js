import { ref, watch } from 'vue'
import LZString from 'lz-string'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
function minify(wishlists) {
  return wishlists.map(wl => ({
    n: wl.name,
    w: wl.wishes.map(w => {
      const wish = { n: w.name }
      if (w.link) wish.l = w.link
      if (w.priority) wish.p = w.priority
      return wish
    }),
  }))
}

function expand(minimal) {
  return minimal.map(wl => ({
    id: uid(),
    name: wl.n,
    wishes: wl.w.map(w => ({
      id: uid(),
      name: w.n,
      link: w.l || '',
      priority: w.p || '',
    })),
  }))
}

function encode(wishlists) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(minify(wishlists)))
}

function decode(str) {
  try {
    return expand(JSON.parse(LZString.decompressFromEncodedURIComponent(str)))
  } catch {
    return null
  }
}

function loadFromUrl() {
  const hash = window.location.hash.slice(1)
  if (!hash) return []
  return decode(hash) ?? []
}

function saveToUrl(wishlists) {
  if (wishlists.length === 0) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
    return
  }
  history.replaceState(null, '', `#${encode(wishlists)}`)
}

export function useWishlists() {
  const wishlists = ref(loadFromUrl())

  watch(wishlists, (val) => saveToUrl(val), { deep: true })

  function addWishlist(name) {
    wishlists.value.push({ id: uid(), name, wishes: [] })
  }

  function removeWishlist(id) {
    wishlists.value = wishlists.value.filter(w => w.id !== id)
  }

  function renameWishlist(id, name) {
    const wl = wishlists.value.find(w => w.id === id)
    if (wl) wl.name = name
  }

  function addWish(wishlistId, wish) {
    const wl = wishlists.value.find(w => w.id === wishlistId)
    if (wl) wl.wishes.push({ id: uid(), name: wish.name, link: wish.link || '', priority: wish.priority || '' })
  }

  function removeWish(wishlistId, wishId) {
    const wl = wishlists.value.find(w => w.id === wishlistId)
    if (wl) wl.wishes = wl.wishes.filter(w => w.id !== wishId)
  }

  function editWish(wishlistId, wishId, updates) {
    const wl = wishlists.value.find(w => w.id === wishlistId)
    if (!wl) return
    const wish = wl.wishes.find(w => w.id === wishId)
    if (wish) Object.assign(wish, updates)
  }

  return { wishlists, addWishlist, removeWishlist, renameWishlist, addWish, removeWish, editWish }
}
