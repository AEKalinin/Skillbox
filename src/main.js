import Vue from 'vue';
import App from './App.vue';
import data from './data';
import func from './func';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');

func(data.message1);
func(data.message2);
