export const delay = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration))

export const formatUid = (input: string) =>
  input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

export const strictSelector = (target: Document | HTMLElement, selector: string) => {
  const element = target.querySelector(selector)
  if (!element) throw new Error(`Element not found for selector "${selector}"`)
  if (!(element instanceof HTMLElement)) throw new Error(`Element is not an HTMLElement for selector "${selector}"`)
  return element
}

export const strictSelectorAll = (target: Document | HTMLElement, selector: string) => {
  const elements = target.querySelectorAll(selector)
  if (!elements.length) throw new Error(`Elements not found for selector "${selector}"`)
  return Array.from(elements)
}
