import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from "vue-resource"
import goods from 'components/goods/goods'
import seller from 'components/seller/seller'
import ratings from 'components/ratings/ratings' 
import './common/stylus/index.styl'
Vue.use(VueRouter);
Vue.use(VueResource);
/* eslint-disable no-new */
let app=Vue.extend(App);
let router=new VueRouter({
linkActiveClass:'active'
})

router.map({
	'/goods': {
		component: goods
  },
  '/seller':{
    component:seller
  },
  '/ratings':{
    component:ratings
  },
	
});

router.start(app, '#app');
// router.go('/goods')