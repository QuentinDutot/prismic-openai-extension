import { z } from 'zod'
import { translateText } from '../utils/i18n'
import { delay } from '../utils/utils'

const FieldKeySchema = z.string()

const FieldTypeSchema = z.union([
  z.literal('uid'),
  z.literal('number'),
  z.literal('color'),
  z.literal('html'),
  z.literal('image'),
  z.literal('group'),
])

const FieldValueSchema = z.union([z.string(), z.array(z.unknown())])

const FieldDataSchema = z.object({
  key: FieldKeySchema,
  type: FieldTypeSchema,
  value: FieldValueSchema,
})

type FieldData = z.infer<typeof FieldDataSchema>

const getWidgetFields = (element: Element): FieldData => {
  const key = FieldKeySchema.parse(element.getAttribute('data-widget-key'))
  const classValue = element.classList.value

  let type: FieldData['type'] | null = null
  let value: FieldData['value'] | null = null

  if (classValue.includes('widget-UID')) {
    type = 'uid'
    value = FieldValueSchema.parse(element.querySelector('input')?.value)
  } else if (classValue.includes('widget-Field Number')) {
    type = 'number'
    value = FieldValueSchema.parse(element.querySelector('input')?.value)
  } else if (classValue.includes('widget-Field Color')) {
    type = 'color'
    value = FieldValueSchema.parse(element.querySelector('input')?.value)
  } else if (classValue.includes('widget-StructuredText')) {
    type = 'html'
    value = FieldValueSchema.parse(element.querySelector('.ProseMirror')?.innerHTML)
  } else if (classValue.includes('widget-Image')) {
    type = 'image'
    value = '' // TODO
  } else if (classValue.includes('widget-Groups')) {
    type = 'group'
    value = FieldValueSchema.parse(Array.from(element.querySelectorAll('.widget')).map(getWidgetFields).filter(Boolean))
  }

  if (type === null) throw new Error(`Unknown field type "${type}"`)
  if (value === null) throw new Error(`Unknown field value "${value}" for type "${type}"`)

  return { key, type, value }
}

const setWidgetField = (element: Element, field: FieldData) => {
  element.getAttribute(`[data-widget-key=${field.key}]`)

  

}

let fields = []
let locales = []

const doSync = async () => {
  fields = Array.from(document.querySelectorAll('[data-section=Main] > .widget')).map(getWidgetFields)
  console.log('fields', fields)

  await delay(100)

  document.querySelector('.editor-actions > .translation').click()

  await delay(500)

  const translationModal = document.querySelector('.translation-popup').parentNode.parentNode

  translationModal.querySelector('.priselect-editor-translation-mode').click()

  await delay(100)

  translationModal.querySelector('[data-testid=priselitem-editor-translation-mode-light]').click()

  await delay(100)

  translationModal.querySelector('.priselect-editor-translation-lang').click()

  await delay(100)

  const langElements = translationModal
    .querySelector('.priselect-editor-translation-lang')
    .querySelectorAll('[data-testid]')

  locales = Array.from(langElements).map((element) =>
    element.getAttribute('data-testid').replace('priselitem-editor-translation-lang-', ''),
  )
  console.log('locales', locales)

  await delay(100)

  for (const locale of [locales[0]]) {
    translationModal.querySelector(`[data-testid=priselitem-editor-translation-lang-${locale}]`).click()

    await delay(100)

    translationModal.querySelector('button.primary').click()

    await delay(1500)

    console.log(`locale "${locale}"`)

    for (const field of [fields[0]]) {
      console.log(`i18n before "${field.value}"`)
      const translatedText = await translateText(field.value, locale)
      console.log(`i18n after "${translatedText}"`)

      await delay(100)

      setWidgetField(field.key, translatedText)

      await delay(100)
    }
  }
}

export default doSync
