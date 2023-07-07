import openai from './openai'

export const translateText = async (input: string, lang: string) => {
  console.log(`i18n before "${input}"`)

  const { data } = await openai.createChat([
    {
      role: 'system',
      content: [
        `You are an i18n tool, please translate the user input in ${lang}`,
        'Maintain the format (slugs, plain strings, html, ...), casing and length of the original text.',
      ].join(' '),
    },
    { role: 'user', content: input },
  ])

  const translation = data.choices[0].message?.content ?? ''

  console.log(`i18n after "${translation}"`)

  return translation
}
