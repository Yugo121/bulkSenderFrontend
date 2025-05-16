import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '@/views/SettingsView.vue'
import BrandsView from '@/views/BrandsView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import ParametersView from '@/views/ParametersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/brands',
      name: 'brands',
      component: BrandsView,
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView
    },
    {
      path: '/parameters',
      name: 'parameters',
      component: ParametersView
    }
  ],
})

export default router
