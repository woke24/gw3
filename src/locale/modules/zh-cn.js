import locale from 'element-plus/dist/locale/zh-cn.mjs'
const lang = {
  el: locale.el, // element内部国际化
  message: {
    language: '中文',
    common: {
      search: '搜索',
      searchTip: '请输入关键词进行检索',
      add: '新增',
      update: '编辑',
      del: '删除',
      delBat: '批量删除',
      delTip: '确定删除选中的数据吗？',
      handle: '操作',
      exportExcel: '导出Excel',
      exportExcelTip: '请输入导出文件名'
    },
    menu: {
      init: {
        name: 'init',
        index: 'index'
      },
      choose: {
        name: 'choose',
        index: 'index'
      },
      dashboard: {
        name: 'dashboard',
        index: 'index'
      },
      test: {
        name: 'test',
        index: 'index'
      },
      library: {
        name: 'library',
        index: 'index'
      },
      fitness: {
        name: 'fitness',
        index: 'index'
      },
      device: {
        name: 'device',
        index: 'index'
      },
      community: {
        name: 'community',
        index: 'index'
      },
      application: {
        name: 'application',
        index: 'index'
      },
      system: {
        name: '系统目录',
        redirect: '重定向页面',
        '404': '404',
        '401': '401'
      },
    },
    system: {
      title: '后台管理系统',
      subTitle: '时间不在于你拥有多少,而在于你怎样使用。',
      welcome: '欢迎登录',
      login: '登录',
      userName: '用户名',
      password: '密码',
      contentScreen: '内容全屏',
      fullScreen: '全屏',
      fullScreenBack: '退出全屏',
      github: '访问github地址',
      changePassword: '修改密码',
      loginOut: '退出登录',
      user: '管理员',
      size: {
        default: '默认',
        large: '大',
        small: '小',
      },
      setting: {
        name: '系统设置',
        style: {
          name: '整体风格设置',
          default: '默认菜单风格',
          light: '亮色菜单风格',
          chinese: '中国水墨风',
          dark: '暗色菜单风格'
        },
        primaryColor: {
          name: '主题色',
          blue: '默认蓝',
          red: '玫瑰红',
          violet: '优雅紫',
          green: '故事绿',
          cyan: '明青',
          black: '极客黑'
        },
        other: {
          name: '其他设置',
          showLogo: '显示logo',
          showBreadcrumb: '显示面包屑导航',
          keepOnlyOneMenu: '保持一个菜单展开',
        }
      },
      tab: {
        reload: '重新加载',
        closeAll: '关闭所有标签',
        closeOther: '关闭其他标签',
        closeCurrent: '关闭当前标签'
      }
    },
    device: {
      discover: '发现',
      choose: '选择',
      switch: '切换',
      detection: '检查',
      list: '设备列表',
      pair: '配对',
      noDevice: '未检测到设备',
      noDeviceTip: '请连接设备',
      chooseDevice: '选择设备进行配对',
      play: '选择您想玩的游戏类型以继续！',
      select: '选择',
      check: '检查'
    },
    fitness: {
      title: '今日健身数据',
      change: '点击更换'
    },
    bot: {
      title: '设备'
    },
    main: {
      peripherals: {
        headSet: '头显',
        leftController: '左控制器',
        rightController: '右控制器'
      },
      device: {
        directionSensor: '方向传感器',
        leftFootSensor: '左脚传感器',
        rightFootSensor: '右脚传感器',
        vehicleHub: '坐姿'
      },
      deviceInfo: {
        directionSensor: '方向传感器',
        leftFootSensor: '左脚传感器',
        rightFootSensor: '右脚传感器',
        vehicleHub: '坐姿',
        receiver: '接收器',
      },
      accessories: {
        armBand: '臂带'
      },
      info: {
        currentDevice: '当前设备',
        connected: '已连接',
        disconnected: '未连接',
        activationTime: '激活时间',
        lastUsedTime: '最后使用时间',
        switchDevice: '切换设备'
      },
      settings: {
        name: '设置',
        initialRearing: '初始配对',
        quickRepairing: '快速修复',
        updateFirmware: '固件更新',
        troubleshootSensors: '故障排除'
      }
    },
    login: {
      title: '登录',
      subtitle: '今日加入',
      meta: '使用Meta登录',
      or: '或',
      createAccount: '创建账号',
      termsOfService: '同意服务条款',
      privacyPolicy: '隐私政策',
      haveAccount: '已有账号？',
      signIn: '登录',
      setPassword: '设置密码',
      verify: '验证',
    },
    signIn: {
      headerTitle: '登录',
      rememberMe: '记住我',
      forgotPassword: '忘记密码？',
      signIn: '登录',
      tips: '没有账号？',
      createAccount: '创建账号',
    }
  }
}

export default lang