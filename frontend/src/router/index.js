import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// Routes
import auth from './auth'
import dashboard from './dashboard'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: '404',
    component: () => import('@/components/PageNotFound.vue')
  },
  ...dashboard,
  ...auth
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Is User Authenticated
router.beforeEach((to, from, next) => {
  const { isLoggedIn } = store.state.auth

  if (!to.matched.some(record => record.meta.guest)) {
    // dashboard pages
    if (!isLoggedIn) {
      next({
        name: 'login',
        params: { nextUrl: to.name }
      })
    } else {
      next()
    }
  } else {
    // Auth page
    if (isLoggedIn) {
      next({ path: from.fullPath })
    } else {
      next()
    }
  }
})

export default router
