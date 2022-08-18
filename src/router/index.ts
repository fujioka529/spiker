import { createRouter, createWebHistory } from 'vue-router'
import { useAccessToken } from '../store/access_token'

import Measurement from '../pages/Measurement.vue'
import MeasurementChart from '../pages/MeasurementChart.vue'
import Monitor from '../pages/Monitor.vue'
import Login from '../pages/Login.vue'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  { path: '/login', name: 'login', component: Login },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/',
        name: 'monitor',
        component: Monitor,
        meta: { requiresAuth: true },
      },
      {
        path: '/measurements',
        name: 'measurement',
        component: Measurement,
        meta: { requiresAuth: true },
      },
      {
        path: '/measurements/:id',
        name: 'measurementChart',
        component: MeasurementChart,
        meta: { requiresAuth: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useAccessToken()
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !store.getAccessToken
  ) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    console.log('route')
    next()
  }
})

export default router
