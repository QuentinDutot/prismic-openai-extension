import { z } from 'zod'

export const FieldValueSchema = z.union([z.string(), z.array(z.array(z.unknown()))])

export const FieldDataSchema = z.object({
  key: z.string(),
  type: z.union([z.literal('uid'), z.literal('number'), z.literal('color'), z.literal('html'), z.literal('group')]),
  value: FieldValueSchema,
})

export type FieldData = z.infer<typeof FieldDataSchema>

export const getFieldType = (element: Element): FieldData['type'] | null => {
  if (element.classList.value.includes('widget-UID')) {
    return 'uid'
  } else if (element.classList.value.includes('widget-Field Number')) {
    return 'number'
  } else if (element.classList.value.includes('widget-Field Color')) {
    return 'color'
  } else if (element.classList.value.includes('widget-StructuredText')) {
    return 'html'
  } else if (element.classList.value.includes('widget-Groups')) {
    return 'group'
  } else {
    return null
  }
}

export const isFieldSupported = (element: Element): boolean => {
  const type = getFieldType(element) ?? ''
  return ['uid', 'number', 'color', 'html', 'group'].includes(type)
}
