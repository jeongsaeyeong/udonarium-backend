import 'dotenv/config'; // ✅ 최상단에 추가!
import { routing } from '@udonarium-backend/core';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = routing(new Hono());
const port = (process.env.PORT || 3000) as number;

console.log("SKYWAY_APP_ID:", process.env.SKYWAY_APP_ID);
console.log("SKYWAY_SECRET:", process.env.SKYWAY_SECRET ? "Loaded" : "Missing");

// ✅ Hono에서 CORS 설정을 이렇게 추가해야 해!
app.use('*', cors({
  origin: "http://localhost:4200",
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// ✅ SkyWay Auth Token API 추가
app.get('/api/token', async (c) => {
  console.log("SKYWAY_APP_ID:", process.env.SKYWAY_APP_ID);
  console.log("SKYWAY_SECRET:", process.env.SKYWAY_SECRET ? "Loaded" : "Missing");

  if (!process.env.SKYWAY_APP_ID || !process.env.SKYWAY_SECRET) {
    console.error("❌ Missing SkyWay API credentials!");
    return c.text('Forbidden: Missing SkyWay API credentials', 403);
  }

  console.log("✅ SkyWay API Key Loaded Successfully");
  return c.json({
    appId: process.env.SKYWAY_APP_ID,
    secret: process.env.SKYWAY_SECRET
  });
});

serve({
  fetch: app.fetch,
  port
});

console.log(`✅ Server is running on http://localhost:${port}`);
console.log(`✅ SkyWay Token API: http://localhost:${port}/api/token`);
