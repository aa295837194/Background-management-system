import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme



axios.defaults.baseURL=`http://127.0.0.1:8888/api/private/v1/`;
Vue.prototype.$http=axios;
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.component('tree-table',TreeTable)
Vue.filter('dateFormater',function (val) {
  const dt=new Date(val)
  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDay()+'').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss} `

})
Vue.config.productionTip = false
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token');

  return config;
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')