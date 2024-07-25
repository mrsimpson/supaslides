import { defineConfig } from 'vite'
import dotenv from 'dotenv'

// Load environment variables from.env file
dotenv.config({ path: ['.env.local', '../../.env.local', '.env'] })

// https://vitejs.dev/config/
export default defineConfig({})
