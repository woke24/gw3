import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import { vitePluginSvg } from "@webxrd/vite-plugin-svg"
import { resolve } from 'path'

const pathResolve = (dir) => {
  return resolve(__dirname, ".", dir)
}

const alias = {
  '@': pathResolve("src")
}

/** 
 * @description-en vite document address
 * @description-cn vite官网
 * https://vitejs.cn/config/ */
export default defineConfig(({ command }) => {
  const prodMock = true;
  return {
    base: './',
    resolve: {
      alias
    },
    server: {
      port: 3001,
      host: '0.0.0.0',
      open: true,
      proxy: {
        '/api/v3': {
          target: 'http://172.16.100.130:8089',
          changeOrigin: true,
          secure: false
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks (id) {
            if (id.includes('node_modules')) {
              if (id.includes('echarts')) return 'echarts';
              if (id.includes('element-plus')) return 'element-plus';
              return 'vendor';
            }
          }
        }
      }
    },
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: command !== 'serve' && prodMock,
        watchFiles: true,
        injectCode: `
          import { setupProdMockServer } from '../mockProdServer';
          setupProdMockServer();
        `,
        logger: true,
      }),
      vitePluginSvg({
        // 必要的。必须是绝对路径组成的数组。
        iconDirs: [
          resolve(__dirname, 'src/assets/svg'),
          resolve(__dirname, 'src/assets/svg/device'),
          resolve(__dirname, 'src/assets/svg/game'),
        ],
        // 必要的。入口script
        main: resolve(__dirname, 'src/main.js'),
        symbolIdFormat: 'icon-[name]'
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['import', 'legacy-js-api'],
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    }
  }
})

