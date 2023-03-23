import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store' 

import { PeraWalletConnect } from "@perawallet/connect";
import MyAlgoConnect from '@randlabs/myalgo-connect';

//global style
import './assets/global.css'

var app = createApp(App);
app.config.globalProperties.$peraWallet = new PeraWalletConnect();
app.config.globalProperties.$myAlgoWallet = new MyAlgoConnect();
app.beforeCreate = () => {store.commit('storeInit')};
app.use(store).use(router).mount('#app');
