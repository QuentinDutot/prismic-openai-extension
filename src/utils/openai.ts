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

const createChat = async (messages: { role: 'system' | 'user'; content: string }[]) => {
  const client = await getClient()
  return await client.createChatCompletion({
    model: 'gpt-3.5-turbo-16k',
    messages,
  })
}

const openai = {
  createChat,
  createImage: () => {},
  createAudio: () => {},
}

export default openai
