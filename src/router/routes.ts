import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'index', component: () => import('../pages/IndexPage.vue') },
      { path: 'create', name: 'create', component: () => import('../pages/CreatePage.vue') },
      { path: 'edit/:id', name: 'edit', component: () => import('../pages/EditPage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/IndexPage.vue')
  }
]

export default routes
