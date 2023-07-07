import doSync from '../sync/core'

console.log('content script')

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('content action')

  if (request.action === 'sync') {
    console.log('sync received')

    await doSync()

    console.log('sync processed')

    sendResponse()
  }

  return true
})
