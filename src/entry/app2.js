import 'babel-polyfill'
import Vue from 'vue'
import Counter from '../components/Counter2.vue'
import store from '../store/store2'
import '../css/global.css'

new Vue({
  el: '#app',
  store,
  components: {
    'my-com': Counter
  }
})
