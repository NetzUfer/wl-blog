import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// Server-Initialisierung importieren
// Diese Zeile sorgt dafür, dass die Datenbankinitialisierung beim Serverstart ausgeführt wird
import './src/server.js';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
});