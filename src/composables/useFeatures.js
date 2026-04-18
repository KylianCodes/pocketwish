import { ref, watch } from 'vue'

export function useFeatures() {
  const stored = localStorage.getItem('pocketwish-features')
  const features = ref(stored ? JSON.parse(stored) : { links: false, priority: false })

  watch(features, (val) => {
    localStorage.setItem('pocketwish-features', JSON.stringify(val))
  }, { deep: true })

  return { features }
}
