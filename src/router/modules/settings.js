import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/settings',
    name: 'settings',
    component: Layout,
    meta: { title: 'message.menu.settings.name' },
    children: [
      {
        path: 'index',
        component: createNameComponent(() => import('@/views/settings/index.vue')),
        meta: { title: 'message.menu.settings.name', showFooter: true, cache: true }
      },
      {
        path: 'personalCenter',
        component: createNameComponent(() => import('@/views/settings/personal-center.vue')),
        meta: { title: 'personal center', showFooter: true, cache: true }
      },
      {
        path: 'achievementCenter',
        component: createNameComponent(() => import('@/views/settings/achievement-center.vue')),
        meta: { title: 'achievement center', showFooter: true, cache: true }
      },
      {
        path: 'rewards',
        component: createNameComponent(() => import('@/views/settings/rewards.vue')),
        meta: { title: 'rewards', showFooter: true, cache: true }
      },
      {
        path: 'pointsHistory',
        component: createNameComponent(() => import('@/views/settings/points-history.vue')),
        meta: { title: 'points history', showFooter: true, cache: true }
      },
      {
        path: 'editAddress',
        component: createNameComponent(() => import('@/views/settings/edit-address.vue')),
        meta: { title: 'edit address', showFooter: true, cache: true }
      },
      {
        path: 'changePassword',
        component: createNameComponent(() => import('@/views/settings/change-password.vue')),
        meta: { title: 'change password', showFooter: true, cache: true }
      }
    ]
  }
]

export default route