import { createRouter, createWebHistory } from 'vue-router';

const DEFAULT_TITLE = 'D&D Helper';

const routerOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/Home.vue'),
    },
    {
      path: '/character/:id',
      name: 'character',
      component: () => import('@/pages/character/Character.vue'),
      meta: {
        title: 'Character | TTRPGZ',
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
