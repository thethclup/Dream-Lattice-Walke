import { NextResponse } from 'next/server';

/**
 * Dream Walke Orchestrator - Agent Info Endpoint
 * 
 * Provides core identity and context for the agent.
 * Used for ERC-8004 discovery, A2A, and platform integrations.
 */

export async function GET() {
  return NextResponse.json({
    name: "Dream Walke Orchestrator",
    description: "Master of lucid dreaming and subconscious navigation",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Dream Walke",
    version: "1.0.0",
    type: "ERC-8004 Agent",
    lastUpdated: new Date().toISOString()
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      received: body,
      agent: "Dream Walke Orchestrator",
      status: "active"
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
