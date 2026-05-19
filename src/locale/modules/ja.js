import locale from 'element-plus/dist/locale/ja.mjs'

const lang = {
  el: locale.el, // element-plus i18 setting
  message: {
    language: '日本語',
    common: {
      search: '検索',
      searchTip: 'キーワードを入力してください',
      add: '追加',
      update: '更新',
      del: '削除',
      delBat: '選択した項目を削除',
      delTip: '選択したデータを削除してもよろしいですか？',
      handle: '操作',
      exportExcel: 'Excelにエクスポート',
      exportExcelTip: 'ファイル名を入力してください'
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
      title: 'バックエンドシステム',
      subTitle: '美しい管理画面を書くためのわずかな行数',
      welcome: 'ログインへようこそ',
      login: 'ログイン',
      userName: 'ユーザー名',
      password: 'パスワード',
      contentScreen: 'コンテンツ全画面表示',
      fullScreen: '全画面表示',
      fullScreenBack: '全画面表示を終了',
      github: 'GitHubを訪問',
      changePassword: 'パスワードの変更',
      loginOut: 'ログアウト',
      user: '管理者',
      size: {
        default: 'デフォルト',
        large: 'ラージ',
        small: 'スモール',
      },
      setting: {
        name: '設定',
        style: {
          name: 'フルスタイル設定',
          default: 'デフォルトメニュースタイル',
          light: 'ライトメニュースタイル',
          chinese: '中国風メニュースタイル',
          dark: 'ダークメニュースタイル'
        },
        primaryColor: {
          name: 'プライマリーカラー',
          blue: 'デフォルトの青',
          red: 'ローズレッド',
          violet: 'グレイスバイオレット',
          green: 'ストーリーグリーン',
          cyan: 'シアン',
          black: 'ギークブラック'
        },
        other: {
          name: 'その他の設定',
          showLogo: 'ロゴを表示',
          showBreadcrumb: 'パンくずリストを表示',
          keepOnlyOneMenu: 'メニューを1つだけ開いたままにする',
        }
      },
      tab: {
        reload: 'リロード',
        closeAll: 'すべてのタグを閉じる',
        closeOther: '他のタグを閉じる',
        closeCurrent: '現在のタグを閉じる'
      }
    },
    device: {
      discover: '発見',
      detection: '確認',
      switch: '切り替え',
      list: 'デバイスリスト',
      choose: '選択',
      pair: 'ペアリング',
      noDevice: 'デバイスが検出されませんでした。',
      noDeviceTip: 'デバイスを接続してください。',
      chooseDevice: 'デバイスを選択してペアリング',
      play: '続けるにはゲームタイプを選択してください！',
      select: '選択',
      check: '確認'
    },
    fitness: {
      title: "今日のフィットネスデータ",
      change: 'クリックして変更'
    },
    bot: {
      title: 'デバイス'
    },
    main: {
      peripherals: {
        headSet: 'ヘッドセット',
        leftController: 'Lコントローラー',
        rightController: 'Rコントローラー'
      },
      device: {
        directionSensor: '方向',
        leftFootSensor: 'フットボール',
        rightFootSensor: 'Rフット',
        vehicleHub: '車両ハブ'
      },
      accessories: {
        armBand: 'アームバンド'
      },
      info: {
        currentDevice: '現在のデバイス',
        connected: '接続済み',
        disconnected: '未接続',
        activationTime: 'アクティベーション時間',
        lastUsedTime: '最終使用時間',
        switchDevice: 'デバイスを切り替える'
      },
      settings: {
        name: '設定',
        initialRearing: '初期対応',
        quickRepairing: 'クイック修理',
        updateFirmware: 'ファームウェア更新',
        troubleshootSensors: 'センサーのトラブルシューティング'
      }
    }
  }
}

export default lang
