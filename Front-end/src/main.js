import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import apolloProvider from './apollo';
import store from './store/index.js';


const app = createApp(App);
app.use(store);
app.use(router);
app.use(vuetify);
app.use(apolloProvider);

app.mount('#app');
