import { OpenaiApiKeyStorage } from '../utils/storage'

console.log('popup script')

const onShowSync = () => {
  const syncButton = document.createElement('button')
  syncButton.innerText = 'Sync'
  syncButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'sync' })
      }
    })
  })

  document.body.appendChild(syncButton)
}

const onShowForm = () => {
  const keyInput = document.createElement('input')
  keyInput.setAttribute('type', 'text')
  keyInput.setAttribute('placeholder', 'OpenAI API Key')

  const saveButton = document.createElement('button')
  saveButton.innerText = 'Save'
  saveButton.addEventListener('click', () => {
    OpenaiApiKeyStorage.set(keyInput.value)

    document.body.removeChild(keyInput)
    document.body.removeChild(saveButton)

    onShowSync()
  })

  document.body.appendChild(keyInput)
  document.body.appendChild(saveButton)
}

if (OpenaiApiKeyStorage.get()) {
  onShowSync()
} else {
  onShowForm()
}
