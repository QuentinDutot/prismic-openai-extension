import { z } from 'zod'
import { Configuration, OpenAIApi } from 'openai'
import { OpenaiApiKeyStorage } from './storage'

const getClient = async () => {
  const apiKey = z.string().parse(await OpenaiApiKeyStorage.get())

  const configuration = new Configuration({
    apiKey,
  })

  const openai = new OpenAIApi(configuration)

  return openai
}

const createCompletion = async (prompt: string) => {
  const client = await getClient()
  return await client.createCompletion({
    model: 'text-davinci-003',
    prompt,
  })
}

const openai = {
  createCompletion,
}

export default openai
