// main.ts
import { createApp } from 'vue'
import './style.css'
import router from './router'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import axios from './plugins/axios'
import { createPinia } from 'pinia'
import { customSvgNamespace } from './plugins/icons'

const app = createApp(App)
app.config.globalProperties.$axios = axios

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'custom',
        sets: {
            custom: customSvgNamespace,
        },
    },
})

app.use(router).use(vuetify).use(createPinia()).mount('#app')