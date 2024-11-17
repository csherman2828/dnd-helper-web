import { createRouter, createWebHistory, type RouterOptions } from 'vue-router';
import HomePage from './HomePage.vue';
import CharacterPage from './pages/CharacterPage.vue';

const DEFAULT_TITLE = 'D&D Helper';

interface CustomRouterOptions extends RouterOptions {
  routes: {
    path: string;
    name: string;
    component: any;
    meta?: {
      title?: string;
    };
  }[];
}

const routerOptions: CustomRouterOptions = {
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
      meta: {
        title: 'Character',
      },
    },
  ],
};

const router = createRouter(routerOptions);

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || DEFAULT_TITLE;
  next();
});

export default router;
