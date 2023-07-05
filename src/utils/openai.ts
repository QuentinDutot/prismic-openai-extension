import { z } from 'zod'
import { Configuration, OpenAIApi } from 'openai'
import { OpenaiApiKeyStorage } from './storage'

const apiKey = z.string().parse(OpenaiApiKeyStorage.get())

const configuration = new Configuration({
  apiKey,
})

const openai = new OpenAIApi(configuration)

export default openai
