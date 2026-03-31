import './sanitize.css'
import './style.css'
// import { $, createElement } from '@utils/dom.js'
import { store } from '@state/store.js'

function init() {
  console.log(`${process.env.APP_NAME} initialized`)
  console.log(`Environment: ${process.env.ENV}`)

  store.subscribe((state) => {
    console.log('State updated:', state)
  })

  store.set('loading', false)
}

init()
