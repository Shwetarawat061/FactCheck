// Vercel Serverless Function: GET /api/health

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'failed',
      code: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed',
    });
  }

  return res.status(200).json({
    status: 'ok',
    configured: Boolean(process.env.GEMINI_API_KEY),
    hasTavily: Boolean(process.env.TAVILY_API_KEY),
    timestamp: new Date().toISOString(),
  });
}
