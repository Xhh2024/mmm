import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Main'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('../views/Home/Home.vue'),
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('../views/UserManage/UserManage.vue'),
      },
      {
        path: '/pet',
        name: 'pet',
        component: () => import('@/views/PetManage/PetManage'),
      },
      {
        path: '/page1',
        name: 'page1',
        component: () => import('@/views/ServiceManage/PageOne'),
      },
      {
        path: '/page2',
        name: 'page2',
        component: () => import('@/views/ServiceManage/PageTwo'),
      },
      {
        path: '/remark',
        name: 'remark',
        component: () => import('@/views/info/Remark'),
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('@/views/info/Article'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Admin/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
