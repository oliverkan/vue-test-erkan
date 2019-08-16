import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as uiv from 'uiv';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VeeValidate from 'vee-validate';

Vue.config.productionTip = false;
Vue.use(uiv);
Vue.use(VeeValidate);

new Vue({
  router,
  store,
  uiv,
  render: h => h(App)
}).$mount("#app");
