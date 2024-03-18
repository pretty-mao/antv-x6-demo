import "./style.css";

import Vue from "vue";
import App from "./App.vue";
import UI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(UI);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
