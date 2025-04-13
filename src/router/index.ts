import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: () => import(/* webpackChunkName: "start" */ '../views/start/index.vue'),
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "main" */ '../views/Main.vue'),
      children: [
        {
          path: '/group',
          name: 'group',
          component: () => import(/* webpackChunkName: "group" */ '../views/group/index.vue'),
        },
        {
          path: 'project/:group/:project',
          name: 'project',
          component: () => import(/* webpackChunkName: "project" */ '../views/project/index.vue'),
        },
      ],
    },
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
