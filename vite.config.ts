import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from '@rollup/plugin-eslint';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [{ ...eslint({ include: 'src/**/*.+(js|jsx|ts|tsx)' }), enforce: 'pre' }, EnvironmentPlugin('all'), react()],
});
