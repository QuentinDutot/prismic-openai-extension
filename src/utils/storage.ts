const setItem = (key: string, value: string) => localStorage.setItem(key, value)
const getItem = (key: string) => localStorage.getItem(key)
const removeItem = (key: string) => localStorage.removeItem(key)

const createStorage = (key: string) => ({
  set: (value: string) => setItem(key, value),
  get: () => getItem(key),
  delete: () => removeItem(key),
})

export const OpenaiApiKeyStorage = createStorage('prismic_openai_api_key')
