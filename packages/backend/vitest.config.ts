import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import {config} from "dotenv";
// Load environment variables from.env file
config({ path: ['.env.test.local', '.env.local', '../../.env.local', '.env'] })

export default defineConfig({
    root: '.',
    esbuild: {
        tsconfigRaw: '{}',
    },
    test: {
        clearMocks: true,
        globals: true,
        setupFiles: ['dotenv/config']
    },
    resolve: {
        alias: [{ find: '@', replacement: resolve(__dirname, '.') }],
    },
});