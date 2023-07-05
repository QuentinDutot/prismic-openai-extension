type StorageType = 'local' | 'sync'

const createStorage = (type: StorageType, key: string) => ({
  set: async (value: string) => new Promise<void>((resolve) => chrome.storage[type].set({ [key]: value }, resolve)),
  get: async () =>
    new Promise<string | undefined>((resolve) => chrome.storage[type].get([key], (result) => resolve(result[key]))),
  remove: async () => new Promise<void>((resolve) => chrome.storage[type].remove(key, resolve)),
})

export const OpenaiApiKeyStorage = createStorage('sync', 'prismic_openai_api_key')
