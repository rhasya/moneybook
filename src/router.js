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
    {
      path: '/money',
      name: 'money',
      component: () => import(/* webpackChunkName: "money" */ './views/Money.vue'),
      meta: { auth: true },
    },
    {
      path: '/plan',
      name: 'plan',
      component: () => import(/* webpackChunkName: "money" */ './views/Plan.vue'),
      meta: { auth: true },
    },
  ],
});

router.beforeResolve((to, from, next) => {
  if (to.meta.auth) {
    if (!localStorage.uid) {
      alert('Need Login!');
      next('/');
      return;
    }
  }
  next();
});

export default router;
