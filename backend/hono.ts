import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { appRouter } from './trpc/app-router';
import { createContext } from './trpc/create-context';
import { routerosService } from './mikrotik/routeros-service';

const app = new Hono();

app.use('*', cors());

app.use(
  '/trpc/*',
  trpcServer({
    endpoint: '/api/trpc',
    router: appRouter,
    createContext,
  }),
);

app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'API is running' });
});

app.get('/dashboard', async (c) => {
  console.log('[api] GET /dashboard');
  try {
    const data = await routerosService.getDashboardData();
    return c.json(data);
  } catch (e) {
    console.error('[api] /dashboard error:', e);
    return c.json({
      error: 'Failed to fetch dashboard data',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.get('/system/stats', async (c) => {
  console.log('[api] GET /system/stats');
  try {
    const data = await routerosService.getSystemStats();
    return c.json(data);
  } catch (e) {
    console.error('[api] /system/stats error:', e);
    return c.json({
      error: 'Failed to fetch system stats',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.post('/system/reboot', async (c) => {
  console.log('[api] POST /system/reboot');
  try {
    const result = await routerosService.reboot();
    return c.json(result);
  } catch (e) {
    console.error('[api] /system/reboot error:', e);
    return c.json({
      error: 'Failed to reboot',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.get('/interfaces', async (c) => {
  console.log('[api] GET /interfaces');
  try {
    const data = await routerosService.getInterfaces();
    return c.json(data);
  } catch (e) {
    console.error('[api] /interfaces error:', e);
    return c.json({
      error: 'Failed to fetch interfaces',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.get('/connections', async (c) => {
  console.log('[api] GET /connections');
  try {
    const data = await routerosService.getConnections();
    return c.json(data);
  } catch (e) {
    console.error('[api] /connections error:', e);
    return c.json({
      error: 'Failed to fetch connections',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.get('/traffic', async (c) => {
  console.log('[api] GET /traffic');
  try {
    const data = await routerosService.getTrafficStats();
    return c.json(data);
  } catch (e) {
    console.error('[api] /traffic error:', e);
    return c.json({
      error: 'Failed to fetch traffic stats',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.get('/signal', async (c) => {
  console.log('[api] GET /signal');
  try {
    const data = await routerosService.getSignalStrength();
    return c.json(data);
  } catch (e) {
    console.error('[api] /signal error:', e);
    return c.json({
      error: 'Failed to fetch signal',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.post('/ping', async (c) => {
  console.log('[api] POST /ping');
  try {
    const body = await c.req.json().catch(() => ({}));
    const host = typeof body?.host === 'string' ? body.host : '8.8.8.8';
    const data = await routerosService.ping(host);
    return c.json(data);
  } catch (e) {
    console.error('[api] /ping error:', e);
    return c.json({
      error: 'Failed to ping',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.get('/sms', async (c) => {
  console.log('[api] GET /sms');
  try {
    const data = await routerosService.getSmsMessages();
    return c.json(data);
  } catch (e) {
    console.error('[api] /sms error:', e);
    return c.json({
      error: 'Failed to fetch sms',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.post('/sms/send', async (c) => {
  console.log('[api] POST /sms/send');
  try {
    const body = await c.req.json().catch(() => ({}));
    const phoneNumber = typeof body?.phoneNumber === 'string' ? body.phoneNumber : '';
    const message = typeof body?.message === 'string' ? body.message : '';
    const data = await routerosService.sendSms(phoneNumber, message);
    return c.json(data);
  } catch (e) {
    console.error('[api] /sms/send error:', e);
    return c.json({
      error: 'Failed to send sms',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.get('/backups', async (c) => {
  console.log('[api] GET /backups');
  try {
    const data = await routerosService.getBackups();
    return c.json(data);
  } catch (e) {
    console.error('[api] /backups error:', e);
    return c.json({
      error: 'Failed to fetch backups',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

app.post('/backups/create', async (c) => {
  console.log('[api] POST /backups/create');
  try {
    const data = await routerosService.createBackup();
    return c.json(data);
  } catch (e) {
    console.error('[api] /backups/create error:', e);
    return c.json({
      error: 'Failed to create backup',
      details: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});

export default app;
