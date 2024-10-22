import { createApp } from 'vue'
import './style.css'
import router from './router'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import axios from './plugins/axios'

const app = createApp(App)

// 전역 property로 등록
app.config.globalProperties.$axios = axios

app.config.globalProperties.$classnum = ''
app.config.globalProperties.$name = ''

const vuetify = createVuetify({
    components,
    directives,
})

app.use(router).use(vuetify).mount('#app')