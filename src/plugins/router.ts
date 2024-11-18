import { createRouter, createWebHistory, type RouterOptions } from 'vue-router';

const DEFAULT_TITLE = 'D&D Helper';

interface CustomRouterOptions extends RouterOptions {
  routes: {
    path: string;
    name: string;
    component: any;
    meta?: {
      title?: string;
      shouldHideToolbar?: boolean;
      shouldIgnoreAuth?: boolean;
    };
  }[];
}

const routerOptions: CustomRouterOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: import('@/pages/home/Home.vue'),
    },
    {
      path: '/character/:id',
      name: 'character',
      component: import('@/pages/character/Character.vue'),
      meta: {
        title: 'Character | TTRPGZ',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/Login.vue'),
      meta: {
        shouldHideToolbar: true,
        shouldIgnoreAuth: true,
        title: 'Login | TTRPGZ',
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/signup/Signup.vue'),
      meta: {
        shouldHideToolbar: true,
        shouldIgnoreAuth: true,
        title: 'Signup | TTRPGZ',
      },
    },
  ],
};

const router = createRouter(routerOptions);

router.beforeEach((to, from, next) => {
  console.log('Global before each', { to, from });
  document.title = (to.meta.title as string) || DEFAULT_TITLE;
  next();
});

export default router;
