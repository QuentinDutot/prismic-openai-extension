// import { Configuration, OpenAIApi } from 'openai'
const { Configuration, OpenAIApi } = require('openai')

console.log('content script', process.env.OPENAI_API_KEY)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

// const chatCompletion = await openai.createChatCompletion({
//   model: 'gpt-3.5-turbo',
//   messages: [{ role: 'user', content: 'Hello world' }],
// })

const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

const getWidgetFields = (element) => {
  const key = element.getAttribute('data-widget-key')
  const classValue = element.classList.value

  let type = ''
  let value = null

  if (classValue.includes('widget-UID')) {
    type = 'uid'
    value = element.querySelector('input').value
  } else if (classValue.includes('widget-Field Number')) {
    type = 'number'
    value = element.querySelector('input').value
  } else if (classValue.includes('widget-Field Color')) {
    type = 'color'
    value = element.querySelector('input').value
  } else if (classValue.includes('widget-StructuredText')) {
    type = 'html'
    value = element.querySelector('.ProseMirror').innerHTML
  } else if (classValue.includes('widget-Image')) {
    type = 'image'
    // TODO
  } else if (classValue.includes('widget-Groups')) {
    type = 'group'
    value = Array.from(element.querySelectorAll('.widget')).map(getWidgetFields)
  } else {
    // TODO crash as one of the widget is not handled
  }

  return { key, type, value }
}

let fields = []
let locales = []

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('content', request, sender)

  if (request.action === 'sync') {
    console.log('Sync action received')

    // const select = document.getElementById("editor-multilanguages-select");
    // console.log(select);
    // select.click();

    fields = Array.from(document.querySelectorAll('[data-section=Main] > .widget')).map(getWidgetFields)
    console.log('fields', fields)

    await delay(50)

    document.querySelector('.editor-actions > .translation').click()

    await delay(200)

    const translationModal = document.querySelector('.translation-popup').parentNode.parentNode

    translationModal.querySelector('.priselect-editor-translation-mode').click()

    await delay(50)

    translationModal.querySelector('[data-testid=priselitem-editor-translation-mode-light]').click()

    await delay(50)

    translationModal.querySelector('.priselect-editor-translation-lang').click()

    await delay(50)

    const langElements = translationModal
      .querySelector('.priselect-editor-translation-lang')
      .querySelectorAll('[data-testid]')

    locales = Array.from(langElements).map((element) =>
      element.getAttribute('data-testid').replace('priselitem-editor-translation-lang-', ''),
    )
    console.log('locales', locales)

    langElements[0].click()

    await delay(50)

    translationModal.querySelector('button.primary').click()

    sendResponse({ result: 'Sync action processed' })
  } else if (request.action === 'test') {
    const response = await fetch('http://localhost:3000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: { data: 'test' }, locales: ['fr-fr'] }),
    })
    console.log('response', response)
  }

  return true
})
