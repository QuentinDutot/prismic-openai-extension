import { z } from 'zod'
import { Configuration, OpenAIApi } from 'openai'
import { OpenaiApiKeyStorage } from './storage'

const getClient = () => {
  const apiKey = z.string().parse(OpenaiApiKeyStorage.get())

  const configuration = new Configuration({
    apiKey,
  })

  const openai = new OpenAIApi(configuration)

  return openai
}

const createCompletion = async (prompt: string) =>
  await getClient().createCompletion({
    model: 'text-davinci-003',
    prompt,
  })

const openai = {
  createCompletion,
}

export default openai
