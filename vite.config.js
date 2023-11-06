import { defineConfig, loadEnv } from 'vite'
import laravel from 'laravel-vite-plugin'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const config = {
    plugins: [
      laravel({
        input: [
          'resources/css/app.css',
          'resources/js/app.js',
          'resources/js/main.js'
        ],
        refresh: true
      })
    ]
  }

  if (env.USING_SAIL) {
    config.server = {
      https: false,
      host: true,
      port: 3009,
      hmr: {
        host: '0.0.0.0', protocol: 'ws'
      }
    }
  }

  return config
})
