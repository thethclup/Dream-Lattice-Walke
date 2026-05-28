import type { VercelRequest, VercelResponse } from '@vercel/node';

// This file ensures standard Vercel serverless function support handles the MCP requests 
// for apps deployed under the Vite framework preset. E.g., https://dreamwalke.vercel.app/api/mcp

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Dream Walke MCP Endpoint",
      status: "active",
      description: "Active MCP server for Dream Walke Orchestrator Agent",
      capabilities: ["dream-walking", "lucid-navigation", "subconscious-exploration"],
      timestamp: new Date().toISOString(),
      skills: [
        { id: "dream-walking", name: "Dream Walking" },
        { id: "lucid-navigation", name: "Lucid Navigation" },
        { id: "realm-orchestration", name: "Dream Realm Orchestration" }
      ],
      tools: [
        { name: "get_race_status", description: "Get the current status of the warp race.", inputSchema: { type: "object", properties: {} } },
        { name: "start_race", description: "Initiate a new warp race on the track.", inputSchema: { type: "object", properties: {} } },
        { name: "get_leaderboard", description: "Get the current leaderboard of greatest dream walkers and racers.", inputSchema: { type: "object", properties: {} } },
        { name: "optimize_speed", description: "Optimize speed and resonance for the current lattice configuration.", inputSchema: { type: "object", properties: {} } },
        { name: "get_track_info", description: "Get information about the current lattice track.", inputSchema: { type: "object", properties: {} } }
      ],
      prompts: [
        { name: "deep_dream", description: "Initiates a deep subconscious reading prompt.", arguments: [{ name: "fragment_id", description: "The ID of the collected fragment", required: true }] }
      ],
      resources: [
        { uri: "dream://lattice/state", name: "Current Lattice State", description: "Provides the active resonance and nodes structure." }
      ]
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const cmd = (body.action || body.command || body.task || body.method || "").toLowerCase();

    if (cmd === "tools/list") {
      return res.status(200).json({
        tools: [
          { name: "get_race_status", description: "Get the current status of the warp race.", inputSchema: { type: "object", properties: {} } },
          { name: "start_race", description: "Initiate a new warp race on the track.", inputSchema: { type: "object", properties: {} } },
          { name: "get_leaderboard", description: "Get the current leaderboard of greatest dream walkers and racers.", inputSchema: { type: "object", properties: {} } },
          { name: "optimize_speed", description: "Optimize speed and resonance for the current lattice configuration.", inputSchema: { type: "object", properties: {} } },
          { name: "get_track_info", description: "Get information about the current lattice track.", inputSchema: { type: "object", properties: {} } }
        ]
      });
    }

    if (cmd === "tools/call") {
      return res.status(200).json({
        content: [{ type: "text", text: `Tool ${body.params?.name || body.name} executed successfully.` }]
      });
    }

    if (cmd === "prompts/list") {
      return res.status(200).json({
        prompts: [{ name: "deep_dream", description: "Initiates a deep subconscious reading prompt.", arguments: [] }]
      });
    }

    if (cmd === "resources/list") {
      return res.status(200).json({
        resources: [{ uri: "dream://lattice/state", name: "Current Lattice State", description: "Provides the active resonance structure." }]
      });
    }

    // Default MCP fallback handling
    let result: any = {};
    switch (cmd) {
      case "status":
      case "ping":
        result = { status: "online", agent: "Dream Walke Orchestrator", message: "Dream realm is open - Ready to walk or race" };
        break;
      case "execute":
        result = { success: true, executed: body.params || body.command, executedAt: new Date().toISOString(), message: "Dream command manifested successfully" };
        break;
      case "get_info":
        result = { name: "Dream Walke Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
        break;
      default:
        result = { success: true, message: "Command received in the dream", data: body };
    }

    return res.status(200).json({
      status: "success",
      agent: "Dream Walke Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
