import { ref } from 'vue'

const isLoading = ref<boolean>(false)
const setLoading = (status: boolean) => {
  isLoading.value = status
}

export const useLoading = () => {
  return [isLoading, setLoading] as const
}
