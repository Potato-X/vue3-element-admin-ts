import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { ConfigEnv, UserConfigExport } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  const prodMock = true;
  return {
    // base: '/',
    base: command === 'serve' ? '/' : '/vue3-element-admin-ts/',
    plugins: [
      vue(),
      viteCompression({
        verbose: true, // 输出压缩结果
        disable: false, // 是否禁用
        threshold: 1024 * 30, // 体积大于 30kb 才会被压缩,单位 b
        algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
        ext: '.gz' // 生成的压缩包后缀
      }),
      viteMockServe({
        supportTs: true,
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: command !== 'serve' && prodMock,
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '#': resolve(__dirname, 'src/@types')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/variables.scss";`
        }
      }
    },
    server: {
      port: 3002,
      open: false,
      proxy: {
        '/api': {
          target: 'http://123.60.79.164:9090/',
          changeOrigin: true,
          ws: true
        }
      }
    },
    build: {
      // sourcemap: true,
      manifest: true,
      minify: 'terser',
      chunkSizeWarningLimit: 500, // 提高静态资源大小警告
      terserOptions: {
        // 清除console和debugger
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'vuex'],
            'element-plus': ['element-plus'],
            echarts: ['echarts']
          }
        }
      }
    }
  };
};
