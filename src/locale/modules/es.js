import locale from 'element-plus/dist/locale/es.mjs';

const lang = {
  el: locale.es, // Configuración de i18n de element-plus
  message: {
    language: 'español',
    common: {
      search: 'buscar',
      searchTip: 'por favor, ingrese una palabra clave',
      add: 'agregar',
      update: 'actualizar',
      del: 'eliminar',
      delBat: 'eliminar seleccionados',
      delTip: '¿Está seguro de eliminar los datos seleccionados?',
      handle: 'manejar',
      exportExcel: 'exportar a Excel',
      exportExcelTip: 'por favor, ingrese el nombre del archivo'
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
      title: 'sistema de administración',
      subTitle: 'unas pocas líneas para crear un hermoso administrador',
      welcome: 'bienvenido al inicio de sesión',
      login: 'iniciar sesión',
      userName: 'nombre de usuario',
      password: 'contraseña',
      contentScreen: 'pantalla completa de contenido',
      fullScreen: 'pantalla completa',
      fullScreenBack: 'volver a pantalla completa',
      github: 'visitar GitHub',
      changePassword: 'cambiar contraseña',
      loginOut: 'cerrar sesión',
      user: 'administrador',
      size: {
        default: 'predeterminado',
        large: 'grande',
        small: 'pequeño'
      },
      setting: {
        name: 'configuración',
        style: {
          name: 'ajuste de estilo completo',
          default: 'estilo de menú predeterminado',
          light: 'estilo de menú claro',
          chinese: 'estilo de menú chino',
          dark: 'estilo de menú oscuro'
        },
        primaryColor: {
          name: 'color principal',
          blue: 'azul predeterminado',
          red: 'rojo rosado',
          violet: 'violeta graciosa',
          green: 'verde de la historia',
          cyan: 'cian',
          black: 'negro para geeks'
        },
        other: {
          name: 'otra configuración',
          showLogo: 'mostrar logotipo',
          showBreadcrumb: 'mostrar ruta de navegación',
          keepOnlyOneMenu: 'mantener solo un menú abierto'
        }
      },
      tab: {
        reload: 'actualizar',
        closeAll: 'cerrar todas las etiquetas',
        closeOther: 'cerrar otras etiquetas',
        closeCurrent: 'cerrar etiqueta actual'
      }
    },
    device: {
      discover: 'Descubrir',
      detection: 'Verificar',
      choose: 'Seleccionar',
      switch: 'Cambiar',
      list: 'Lista de dispositivos',
      pair: 'Emparejar',
      noDevice: 'No se detectó ningún dispositivo.',
      noDeviceTip: 'Conecta el dispositivo.',
      chooseDevice: 'Selecciona el dispositivo para emparejar',
      play: 'Selecciona el tipo de juego que quieres jugar para continuar!',
      select: 'Seleccionar',
      check: 'Check'
    },
    fitness: {
      title: "Datos de actividad física de hoy",
      change: 'Haz clic para cambiar'
    },
    bot: {
      title: 'Dispositivos'
    },
    main: {
      peripherals: {
        headSet: 'Auriculares',
        leftController: 'Controlador L',
        rightController: 'Controlador R'
      },
      device: {
        directionSensor: 'Dirección',
        leftFootSensor: 'Fútbol americano',
        rightFootSensor: 'Pie derecho',
        vehicleHub: 'Centro de vehículos'
      },
      accessories: {
        armBand: 'Brazalete'
      },
      info: {
        currentDevice: 'Dispositivo actual',
        connected: 'Conectado',
        disconnected: 'Desconectado',
        activationTime: 'Tiempo de activación',
        lastUsedTime: 'Último uso',
        switchDevice: 'Cambiar dispositivo'
      },
      settings: {
        name: 'Configuraciones',
        initialRearing: 'Reconocimiento inicial',
        quickRepairing: 'Reparación rápida',
        updateFirmware: 'Actualizar firmware',
        troubleshootSensors: 'Solución de problemas de los sensores'
      }
    }
  }
};

export default lang;
