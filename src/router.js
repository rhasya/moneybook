import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/category',
      name: 'category',
      component: () => import(/* webpackChunkName: "category" */ './views/Category.vue'),
      meta: { auth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // need login
  if (to.meta.auth) {
    const store = router.app.$store;
    if (store == null || store.state.email == null) {
      alert('need login!');
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
