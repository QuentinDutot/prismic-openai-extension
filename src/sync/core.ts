import { z } from 'zod'
import { translateText } from '../utils/i18n'
import { delay, formatUid, strictSelector, strictSelectorAll } from '../utils/utils'
import { FieldValueSchema, getFieldType, isFieldSupported, type FieldData } from './field'

const getWidgetField = (element: Element): FieldData => {
  const key = z.string().parse(element.getAttribute('data-widget-key'))
  const type = getFieldType(element)
  let value: FieldData['value'] | null = null

  switch (type) {
    case 'uid':
    case 'number':
    case 'color':
      value = FieldValueSchema.parse(element.querySelector('input')?.value)
      break
    case 'html':
      value = FieldValueSchema.parse(element.querySelector('.ProseMirror')?.innerHTML)
      break
    case 'group':
      const groups = Array.from(element.querySelectorAll('.widget-Group'))
      const fields = groups.map((group) => strictSelectorAll(group, '.widget').map(getWidgetField).filter(Boolean))
      value = FieldValueSchema.parse(fields)
      break
  }

  if (type === null) throw new Error(`Unknown field type "${type}"`)
  if (value === null) throw new Error(`Unknown field value "${value}" for type "${type}"`)

  return { key, type, value }
}

const setWidgetField = async (element: Element, field: FieldData, locale: string) => {
  let target: HTMLElement | null = null

  switch (field.type) {
    case 'uid':
      target = strictSelector(element, 'input')
      const translatedText = await translateText(field.value, locale)
      const cleanedText = formatUid(translatedText)
      target.value = cleanedText
      break
    case 'number':
    case 'color':
      target = strictSelector(element, 'input')
      target.value = field.value
      break
    case 'html':
      target = strictSelector(element, '.ProseMirror')
      const translatedHtml = await translateText(field.value, locale)
      target.innerHTML = translatedHtml
      break
    case 'group':
      const groupElements = Array.from(element.querySelectorAll('.widget-Group'))
      for (const [groupIndex, groupElement] of groupElements.entries()) {
        const groupWidgets = strictSelectorAll(groupElement, '.widget')
        for (const [widgetIndex, groupWidget] of groupWidgets.entries()) {
          await setWidgetField(groupWidget, field.value[groupIndex][widgetIndex], locale)
        }
      }
      break
  }
}

const doSync = async () => {
  const fields = strictSelectorAll(document, '[data-section=Main] > .widget')
    .filter(isFieldSupported)
    .map(getWidgetField)

  console.log('fields', fields)

  await delay(100)

  strictSelector(document, '.editor-actions .translation').click()

  await delay(500)

  const locales = strictSelectorAll(document, '.priselect-editor-translation-lang [data-testid]').map((element) => {
    const id = element.getAttribute('data-testid')
    if (!id) throw new Error('Element has no data-testid')
    return id.replace('priselitem-editor-translation-lang-', '')
  })

  console.log('locales', locales)

  await delay(100)

  strictSelector(document, '.prismic-overlay').click()

  await delay(100)

  for (const locale of locales) {
    strictSelector(document, '.editor-actions .translation').click()

    await delay(500)

    const translationModal = strictSelector(document, '.translation-popup').parentNode?.parentNode
    if (!(translationModal instanceof HTMLElement)) throw new Error('Translation modal not found')

    await delay(100)

    strictSelector(translationModal, '.priselect-editor-translation-mode').click()

    await delay(100)

    strictSelector(translationModal, '[data-testid=priselitem-editor-translation-mode-light]').click()

    await delay(100)

    strictSelector(translationModal, '.priselect-editor-translation-lang').click()

    await delay(100)

    strictSelector(translationModal, `[data-testid=priselitem-editor-translation-lang-${locale}]`).click()

    await delay(100)

    strictSelector(translationModal, 'button.primary').click()

    await delay(1500)

    console.log(`locale "${locale}"`)

    for (const field of fields) {
      await delay(100)

      console.log(`field "${field.key}"`)

      const element = strictSelector(document, `[data-widget-key=${field.key}]`)

      await setWidgetField(element, field, locale)
    }

    await delay(100)

    strictSelector(document, '.editor-actions .save').click()

    await delay(1500)

    strictSelector(document, '.editor-actions .publish').click()

    await delay(1500)

    strictSelector(document, '#publish-wrapper button.btn-publish').click()

    await delay(1500)
  }
}

export default doSync
