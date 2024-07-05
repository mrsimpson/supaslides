import { defineConfig } from 'vite'
import dotenv from 'dotenv'

// Load environment variables from.env file
dotenv.config({ path: ['.env.template.local', '.env.template'] })

// https://vitejs.dev/config/
export default defineConfig({})
