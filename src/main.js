import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { languages, defaultLocale } from './assets/i18n/index.js';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueI18n from 'vue-i18n';
import store from "./store";
import moment from 'moment';
import FlashMessage from "@smartweb/vue-flash-message";
//import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Default from './Layout/Wrappers/baseLayout.vue';
import Pages from './Layout/Wrappers/pagesLayout.vue';
import Apps from './Layout/Wrappers/appLayout.vue';
//Implementing new font
import './assets/base.scss'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios)
Vue.use(FlashMessage);
Vue.component('default-layout', Default);

Vue.component('userpages-layout', Pages);
Vue.component('apps-layout', Apps);
const messages = Object.assign(languages)
window.axios = require('axios');

Vue.use(VueI18n);
const i18n = new VueI18n({

  locale: defaultLocale,
  messages
})
document.documentElement.lang = defaultLocale;
Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD-MM-YYYY')
  }
})
Vue.filter('formatDateActual', function (value) {
  if (value) {
    return moment(String(value)).format('YYYY-MM')
  }
})


Vue.filter('formatMonth', function(value) {
  if (value) {
      return moment(String(value)).format('MMM  YYYY')
  }
});

Vue.filter('formatdateMonthyear', function(value) {
  if (value) {
      return moment(String(value)).format('DD MMM YYYY')
  }
});

Vue.filter('formatDateTime', function (value) {
  if (value) {
    return moment(String(value)).format('DD-MM-YYYY HH:mm')
  }
})
Vue.filter('formatTime', function (value) {
  if (value) {
    return moment(value, 'HH:mm:ss').format('HH:mm');
  }
})

Vue.filter('formatFullDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD MMMM, YYYY')
  }
})

Vue.filter('formatBirthDate', function (value) {
  if (value) {
    return (moment(String(value)).format('DD MMM ') +  moment().year())
  }
})
Vue.filter('formatBirthDay', function (value) {
  if (value) {
    return (moment().format('dddd'))
  }
})

Vue.filter('calculateAge', function (value) {
  if (value) {
    return  moment().diff(value, 'years')
  }
})
// Vue.filter('calculateAgeinYearandMonth', function (value) {
//   if (value) {
//     return  moment.duration(moment().diff(value));
//   }
// })

Vue.filter('timeFormat', function (string) {
  if (string) {
    return string.substring(0, 5);
  }
})

Vue.filter('formatWithDay', function (value) {
  if (value) {
    return moment(String(value)).format('dddd DD MMMM, YYYY')
  }
})
Vue.filter('formatWithoutYear', function (value) {
  if (value) {
    return moment(String(value)).format('dddd MMMM,DD')
  }
})
Vue.filter('formatMonthDate', function (value) {
  if (value) {
    return moment(String(value)).format('dddd ,DD')
  }
})
Vue.filter('formatWithoutYearMonth', function (value) {
  if (value) {
    return moment(String(value)).format('MMMM')
  }
})
Vue.filter('formatWithYear', function (value) {
  if (value) {
    return moment(String(value)).format('YYYY')
  }
})

Vue.filter('formatweekname', function (value) {
  if (value) {
    return moment(String(value)).format('dddd')
  }
})

Vue.filter('formatWitmonth', function (value) {
  if (value) {
    return moment(String(value)).format('MMMM')
  }
})

Vue.filter('formatWithDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD')
  }
})


Vue.filter("truncate", function(value, length) {
  if(value.length>length){
    return value.substring(0, length)+"...";
  }else{
    return value
  }
});

Vue.prototype.$eventBus = new Vue();

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.data.status === 'E') {
      store.commit("setErrors", error.response.data);
    } else if (error.response.status === 401) {
      store.commit("auth/setUserData", null);
      localStorage.removeItem("authToken");
      router.push({ name: "Login" });
    } else {
      return Promise.reject(error);
    }
  }
);

axios.interceptors.request.use(function (config) {
  config.headers.common = {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  config.headers['Accept-Language'] = localStorage.getItem("selected");
  return config;
});

new Vue({
  router,
  vuetify,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
