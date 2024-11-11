import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './HomePage.vue';
import CharacterPage from './CharacterPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/character/:id',
      name: 'character',
      component: CharacterPage,
    },
  ],
});

export default router;
