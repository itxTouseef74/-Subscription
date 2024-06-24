
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';
import vuetify  from 'vite-plugin-vuetify';


dotenv.config();

export default defineConfig({
  plugins: [vue()
    ,vuetify({autoImport: true})
  ],
});
