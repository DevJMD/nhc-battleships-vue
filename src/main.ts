import { createApp }   from 'vue';
import { createPinia } from 'pinia';
import App             from './App.vue';

import './assets/scss/app.scss';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount('#app');
