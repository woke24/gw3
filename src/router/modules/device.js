import Layout from '@/layout/index.vue' // 引入布局组件
import { createNameComponent } from '../createNode'

const route = [
  {
    path: '/device',
    component: Layout, // 使用布局组件作为父壳
    name: 'DeviceLayout',
    redirect: '/device/detection',
    children: [
      {
        path: 'detection',
        name: 'deviceDetection',
        component: createNameComponent(() => import('@/views/device/detection.vue')),
        meta: { title: 'message.device.check', showFooter: false, hideTabs: false }
      },
      {
        path: 'discover',
        name: 'deviceDiscover',
        component: createNameComponent(() => import('@/views/device/init.vue')),
        meta: { title: 'message.device.list', showFooter: false, hideTabs: false }
      },
      {
        path: 'choose',
        name: 'deviceChoose',
        component: createNameComponent(() => import('@/views/device/choose.vue')),
        meta: { title: 'message.device.choose', showFooter: false, hideTabs: false }
      },
      {
        path: 'switch',
        name: 'deviceSwitch',
        component: createNameComponent(() => import('@/views/device/switch.vue')),
        meta: { title: 'message.device.switch', showFooter: false, hideTabs: false }
      },
      {
        path: 'walkcPair',
        name: 'walkcPair',
        component: createNameComponent(() => import('@/views/device/walkc/pair.vue')),
        meta: { title: 'message.device.pair', showFooter: false, hideTabs: false }
      },
      {
        path: 'walkc2Pair',
        name: 'walkc2Pair',
        component: createNameComponent(() => import('@/views/device/walkc2/pair.vue')),
        meta: { title: 'message.device.pair', showFooter: false, hideTabs: false }
      },
      {
        path: 'walkc2CorePair',
        name: 'walkc2CorePair',
        component: createNameComponent(() => import('@/views/device/walkc2Core/pair.vue')),
        meta: { title: 'message.device.pair', showFooter: false, hideTabs: false }
      },
      {
        path: 'walkc2EnhancedPair',
        name: 'walkc2EnhancedPair',
        component: createNameComponent(() => import('@/views/device/walkc2Enhanced/pair.vue')),
        meta: { title: 'message.device.pair', showFooter: false, hideTabs: false }
      },
      {
        path: 'walkc3UltraPair',
        name: 'walkc3UltraPair',
        component: createNameComponent(() => import('@/views/device/walkc3Ultra/pair.vue')),
        meta: { title: 'message.device.pair', showFooter: false, hideTabs: false }
      },
      {
        path: 'locosPair',
        name: 'locosPair',
        component: createNameComponent(() => import('@/views/device/locos/pair.vue')),
        meta: { title: 'message.device.pair', showFooter: false, hideTabs: false }
      },
      {
        path: 'vehicleHubPair',
        name: 'vehicleHubPair',
        component: createNameComponent(() => import('@/views/device/vehicleHub/pair.vue')),
        meta: { title: 'message.device.pair', showFooter: false, hideTabs: false }
      },
      {
        path: 'armbandPair',
        name: 'armbandPair',
        component: createNameComponent(() => import('@/views/device/armband/pair.vue')),
        meta: { title: 'message.device.pair', showFooter: false, hideTabs: false }
      },
      {
        path: 'pair',
        name: 'pair',
        component: createNameComponent(() => import('@/views/device/pair/index.vue')),
        meta: { title: 'message.device.pair', showFooter: false, hideTabs: false }
      },
    ]
  }
]

export default route