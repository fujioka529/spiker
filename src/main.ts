import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'
import dayjs from 'dayjs'

import visibility from 'vue-visibility-change'
import './assets/css/destyle.css'
import './assets/scss/style.scss'
import './assets/fontawesome/css/all.min.css'
import { intervalManager } from './lib/interval_manager'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const pinia = createPinia()
pinia.use(piniaPersist)

visibility.change((evt, hidden) => {
  if (hidden) {
    intervalManager.pause()
  } else {
    intervalManager.resume()
  }
})

import * as utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
app.config.globalProperties.$dayjs = dayjs
app.use(visibility)
app.component('Datepicker', Datepicker)
app.mount('#app')
