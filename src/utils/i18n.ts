import openai from './openai'

export const translateText = async (input: string, lang: string) => {
  const { data } = await openai.createCompletion(
    [
      `Translate in ${lang} the text: "${input}"`,
      "Do not add new line characters where they're not present in the original text.",
    ].join(' '),
  )

  const { text, finish_reason } = data.choices[0]

  if (finish_reason !== 'stop') {
    // TODO
  }

  const translatedText = (text ?? '').trim()

  return translatedText
}
