import { ref, watch } from 'vue'

function loadFeatures() {
  try {
    const stored = localStorage.getItem('pocketwish-features')
    return stored ? JSON.parse(stored) : { links: false, priority: false }
  } catch {
    return { links: false, priority: false }
  }
}

export function useFeatures() {
  const features = ref(loadFeatures())

  watch(features, (val) => {
    localStorage.setItem('pocketwish-features', JSON.stringify(val))
  }, { deep: true })

  return { features }
}
