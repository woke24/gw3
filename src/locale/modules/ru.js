import ruLocale from 'element-plus/dist/locale/ru.mjs'

const lang = {
  el: ruLocale.el, // настройки i18 элемента плюс
  message: {
    language: 'Русский',
    common: {
      search: 'поиск',
      searchTip: 'введите ключевое слово',
      add: 'добавить',
      update: 'обновить',
      del: 'удалить',
      delBat: 'удалить выбор',
      delTip: 'Вы уверены, что хотите удалить выбранные данные?',
      handle: 'обработка',
      exportExcel: 'экспорт в Excel',
      exportExcelTip: 'введите имя файла'
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
      title: 'система управления',
      subTitle: 'несколько строк для написания красивого администратора',
      welcome: 'добро пожаловать на страницу входа',
      login: 'вход',
      userName: 'имя пользователя',
      password: 'пароль',
      contentScreen: 'полноэкранный режим контента',
      fullScreen: 'полноэкранный режим',
      fullScreenBack: 'выйти из полноэкранного режима',
      github: 'посетить GitHub',
      changePassword: 'изменить пароль',
      loginOut: 'выйти из системы',
      user: 'администратор',
      size: {
        default: 'по умолчанию',
        large: 'большой',
        small: 'маленький',
      },
      setting: {
        name: 'настройка',
        style: {
          name: 'полный стиль меню',
          default: 'стандартный стиль меню',
          light: 'светлый стиль меню',
          chinese: 'китайский стиль меню',
          dark: 'темный стиль меню'
        },
        primaryColor: {
          name: 'основной цвет',
          blue: 'стандартный синий',
          red: 'розовый',
          violet: 'фиолетовый',
          green: 'зеленый',
          cyan: 'голубой',
          black: 'черный'
        },
        other: {
          name: 'другие настройки',
          showLogo: 'показать логотип',
          showBreadcrumb: 'показать хлебные крошки',
          keepOnlyOneMenu: 'открыть только одно меню',
        }
      },
      tab: {
        reload: 'обновить',
        closeAll: 'закрыть все вкладки',
        closeOther: 'закрыть другие вкладки',
        closeCurrent: 'закрыть текущую вкладку'
      }
    },
    device: {
      discover: 'Выявіць',
      detection: 'Праверыць',
      switch: 'Змяніць',
      list: 'Спіс прылад',
      choose: 'Выберыць',
      pair: 'Падключыць',
      noDevice: 'Прылада не выяўлена.',
      noDeviceTip: 'падключыце прыладу.',
      chooseDevice: 'Выберыце прыладу для падключэння',
      play: 'Выберыце тып гульні, якую хочаце гуляць, каб працягнуць!',
      select: 'Выберыць',
      check: 'Проверить'
    },
    fitness: {
      title: "Дадзеныя аб фітнесе за сёння",
      change: 'Націсніце, каб змяніць'
    },
    bot: {
      title: 'Прылады'
    },
    main: {
      peripherals: {
        headSet: 'Гарнітура',
        leftController: 'L-кантролер',
        rightController: 'Кантролер R'
      },
      device: {
        directionSensor: 'Кірунак',
        leftFootSensor: 'Футбол',
        rightFootSensor: 'Правая нага',
        vehicleHub: 'Цэнтр транспартных сродкаў'
      },
      accessories: {
        armBand: 'Павязка'
      },
      info: {
        currentDevice: 'Акустычныя прылады',
        connected: 'Злучаны',
        disconnected: 'Адключаны',
        activationTime: 'Час актывацыі',
        lastUsedTime: 'Апошні час выкарыстання',
        switchDevice: 'Змяніць прылад'
      },
      settings: {
        name: 'Настройкі',
        initialRearing: 'Ініцыяльнае выраўнаванне',
        quickRepairing: 'Хуткая правядка',
        updateFirmware: 'Абнаўленне праграмнага забеспячэння',
        troubleshootSensors: 'Ухіленне непаладак датчыкаў'
      }
    }
  }
}

export default lang
