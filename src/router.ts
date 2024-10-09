import { createRouter, createWebHistory } from 'vue-router';
import PageView from './HomePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PageView,
    },
  ],
});

export default router;
