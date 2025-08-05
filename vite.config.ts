import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del directorio raíz
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Define las variables de entorno para que estén disponibles en el código del cliente
    define: {
      // Vite reemplazará `process.env.API_KEY` en el código con el valor real
      // de la variable de entorno `API_KEY` durante el proceso de compilación.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})