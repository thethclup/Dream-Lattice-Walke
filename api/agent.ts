import type { VercelRequest, VercelResponse } from '@vercel/node';

// This file ensures standard Vercel serverless function support handles the Agent Info requests 
// for apps deployed under the Vite framework preset. E.g., https://dreamwalke.vercel.app/api/agent

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Dream Walke Orchestrator",
      description: "Master of lucid dreaming and subconscious navigation",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Dream Walke",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      received: req.body,
      agent: "Dream Walke Orchestrator",
      status: "active"
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
