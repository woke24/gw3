import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/init',
    name: 'Init',
    component: Layout,
    meta: { title: 'message.menu.init.name' },
    children: [
      {
        path: 'index',
        component: createNameComponent(() => import('@/views/init/index.vue')),
        meta: { title: 'message.menu.init.name', showFooter: false, cache: true }
      }
    ]
  },
  {
    path: '/library',
    name: 'Library',
    component: Layout,
    meta: { title: 'message.menu.library.name' },
    children: [
      {
        path: 'index',
        name: 'LibraryIndex',
        component: createNameComponent(() => import('@/views/library/index.vue')),
        meta: { title: 'message.menu.library.name', showFooter: true, cache: true },
        children: [
          {
            path: '',
            name: 'LibraryHome',
            component: createNameComponent(() => import('@/views/library/home.vue')),
            meta: { title: 'message.menu.library.name', showFooter: true, cache: true }
          },
          {
            path: 'detail/:id:/:name',
            name: 'GameDetail',
            component: createNameComponent(() => import('@/views/library/detail.vue')),
            meta: { title: 'message.menu.library.name', showFooter: true, cache: true },
            props: true
          }
        ]
      }
    ]
  },
  {
    path: '/fitness',
    name: 'fitness',
    component: Layout,
    meta: { title: 'message.menu.fitness.name' },
    children: [
      {
        path: 'index',
        component: createNameComponent(() => import('@/views/fitness/index.vue')),
        meta: { title: 'message.menu.fitness.name', showFooter: true, cache: true }
      }
    ]
  },
  {
    path: '/device',
    name: 'device',
    component: Layout,
    meta: { title: 'message.menu.device.name' },
    children: [
      {
        path: 'index',
        component: createNameComponent(() => import('@/views/device/index.vue')),
        meta: { title: 'message.menu.device.name', showFooter: true, cache: true }
      }
    ]
  },
  {
    path: '/community',
    name: 'community',
    component: Layout,
    meta: { title: 'message.menu.community.name' },
    children: [
      {
        path: 'index',
        component: createNameComponent(() => import('@/views/community/index.vue')),
        meta: { title: 'message.menu.community.name', showFooter: true, cache: true }
      }
    ]
  },
  {
    path: '/application',
    name: 'application',
    component: Layout,
    meta: { title: 'message.menu.application.name' },
    children: [
      {
        path: 'index',
        component: createNameComponent(() => import('@/views/application/index.vue')),
        meta: { title: 'message.menu.application.name', showFooter: true, cache: true }
      }
    ]
  }
]

export default route
