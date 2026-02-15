import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/TrueEditr.js'),
            name: 'TrueEditr',
            fileName: 'trueeditr',
            formats: ['umd', 'es']
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {}
            }
        }
    }
});
