import 'babel-polyfill'
import Vue from 'vue'
import Counter from '../components/Counter.vue'
import store from '../store/store'
import '../css/global.css'

new Vue({
  el: '#app',
  store,
  render: h => h(Counter)
})
