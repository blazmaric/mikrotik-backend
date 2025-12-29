import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import apiApp from './hono';

const portRaw = process.env.PORT;
const port = portRaw ? Number(portRaw) : 3000;

const maybeInstallExtraCa = async (): Promise<void> => {
  const caPemRaw = process.env.MIKROTIK_TLS_CA_PEM;
  if (!caPemRaw) return;

  try {
    const fs = await import('node:fs');
    const caPem = caPemRaw.includes('\\n') ? caPemRaw.replace(/\\n/g, '\n') : caPemRaw;
    const caPath = '/tmp/mikrotik-ca.pem';

    fs.writeFileSync(caPath, caPem, { encoding: 'utf8' });

    if (!process.env.NODE_EXTRA_CA_CERTS) {
      process.env.NODE_EXTRA_CA_CERTS = caPath;
    }

    console.log('[backend] installed extra CA cert', {
      caPath,
      nodeExtraCaCerts: process.env.NODE_EXTRA_CA_CERTS,
      caLength: caPem.length,
    });
  } catch (e) {
    console.error('[backend] failed to install extra CA cert', e);
  }
};

await maybeInstallExtraCa();

const app = new Hono();

app.get('/', (c) => {
  return c.json({ status: 'ok', service: 'mikrotik-backend', port });
});

app.route('/api', apiApp);

console.log('[backend] starting server', {
  port,
  mikrotikHost: process.env.MIKROTIK_HOST,
  mikrotikPort: process.env.MIKROTIK_PORT,
  tlsInsecure: process.env.MIKROTIK_TLS_INSECURE,
  hasUser: Boolean(process.env.MIKROTIK_USER),
  hasPassword: Boolean(process.env.MIKROTIK_PASSWORD),
  hasCaPem: Boolean(process.env.MIKROTIK_TLS_CA_PEM),
  nodeExtraCaCerts: process.env.NODE_EXTRA_CA_CERTS,
});

serve({ fetch: app.fetch, port });
