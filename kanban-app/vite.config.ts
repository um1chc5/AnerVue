import { fileURLToPath, URL } from 'node:url'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    }),
    VueDevTools(),
    vueJsx(),
    Components({
      extensions: ['vue', 'md', 'svg', 'ts'],
      directoryAsNamespace: true,
      dts: true,
      globalNamespaces: ['global'],
      include: [/\.vue($|\?)/, /\.md($|\?)/],
      resolvers: [PrimeVueResolver()]
    })
  ],
  resolve: {
    alias: {
      // @ts-ignore
      src: fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
