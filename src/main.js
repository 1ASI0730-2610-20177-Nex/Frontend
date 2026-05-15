import { createApp } from 'vue'
import './style.css'
import App from './app.vue'

import router from "./router.js"
import pinia from "./pinia.js"

import PrimeVue from 'primevue/config';
import {
    ConfirmationService,
    DialogService,
    ToastService,
} from "primevue"


//debugger;

createApp(App)
    .use(PrimeVue, { unstyled: true })
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)

    .use(router)
    .use(pinia)
    .mount('#app')
