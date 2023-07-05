class Storage {
  private key

  constructor(key: string) {
    this.key = key
  }

  public set = (value: string) => localStorage.setItem(this.key, value)

  public get = () => localStorage.getItem(this.key)

  public delete = () => localStorage.removeItem(this.key)
}

export const OpenaiApiKeyStorage = new Storage('prismic_openai_api_key')
