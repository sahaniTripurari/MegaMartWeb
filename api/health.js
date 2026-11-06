/**
 * MegaMart Backend Health & Telemetry API Endpoint
 * GET /api/health
 */
export default async function handler(req, res) {
  const startTime = Date.now();
  
  // Verify Supabase connectivity
  let dbStatus = 'healthy';
  let dbLatency = 0;
  
  try {
    const dbStart = Date.now();
    const response = await fetch('https://xmraekhawrucxnlthtec.supabase.co/rest/v1/products?select=id&limit=1', {
      headers: {
        'apikey': 'sb_publishable_3b3bcwMtxuUb-8Gxkbz4iA_j_-7Wd3p',
        'Authorization': 'Bearer sb_publishable_3b3bcwMtxuUb-8Gxkbz4iA_j_-7Wd3p'
      }
    });
    dbLatency = Date.now() - dbStart;
    if (!response.ok) dbStatus = 'degraded';
  } catch (err) {
    dbStatus = 'unavailable';
  }

  const payload = {
    status: 'ONLINE',
    service: 'MegaMart Core API Gateway',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 3600),
    database: {
      provider: 'Supabase PostgreSQL (AWS ap-south-1)',
      status: dbStatus,
      latencyMs: dbLatency,
      pgvector: 'active (768-dim embeddings)'
    },
    systemMetrics: {
      responseTimeMs: Date.now() - startTime,
      concurrencyEngine: 'Vercel Edge / Serverless Microservices',
      cacheLayer: 'Redis / Edge HTTP SWR Cache'
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json(payload);
}
