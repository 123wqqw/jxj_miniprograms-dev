import App from './App'
import store from "./store";
import uView from "uview-ui";
import VueI18n from 'vue-i18n'  


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.use(uView);
Vue.use(VueI18n);
const i18n = new VueI18n({  
  locale: 'zh-Hans',  // 默认选择的语言
      messages: {
        'zh-Hans': require('./common/lang/zh-Hans'),   // 简体语言包
        'zh-Hant': require('./common/lang/zh-Hant')    // 繁体语言包
      }
}) 
Vue.prototype._i18n = i18n;

App.mpType = 'app'
const app = new Vue({
	i18n,
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(store);
  return {
    app
  }
}
// #endif