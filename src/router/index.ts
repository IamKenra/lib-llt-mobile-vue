import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import AuthService from '../services/authService';

// Mobile views
import MobLoginView from '../views/mobile/MobLoginView.vue';
import MobScannerView from '../views/mobile/MobScannerView.vue';
import MobDetailsView from '../views/mobile/MobDetailsView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'mobile-login',
    component: MobLoginView,
    meta: { requiresAuth: false, isMobile: true }
  },
  {
    path: '/scanner',
    name: 'mobile-scanner',
    component: MobScannerView,
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/details',
    name: 'mobile-details',
    component: MobDetailsView,
    meta: { requiresAuth: true, isMobile: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {
  console.log('Mobile App - Navigating to:', to.path);

  const requiresAuth: boolean = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated: boolean = AuthService.checkAuth();

  console.log('requiresAuth:', requiresAuth);
  console.log('isAuthenticated:', isAuthenticated);

  if (!requiresAuth && !isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    if (to.path !== '/login') {
      console.log('User not authenticated, redirecting to login');
      next('/login');
    } else {
      next();
    }
  } else if (to.path === '/login' && isAuthenticated) {
    console.log('User authenticated, redirecting to scanner');
    next('/scanner');
  } else if (requiresAuth && !isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    next('/login');
  } else {
    next();
  }
});

export default router;