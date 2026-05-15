import type { Router } from 'vue-router'
import { useAuth } from '@/services/auth'

export function setupRouteGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const { isAuthenticated, loadStoredUser, logout } = useAuth()

    loadStoredUser()

    const isLoginPage = to.path === '/login'
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth && !isAuthenticated.value) {
      if (!isLoginPage) {
        next('/login')
      } else {
        next()
      }
    } else if (isLoginPage && isAuthenticated.value) {
      next('/dashboard')
    } else {
      next()
    }
  })
}
