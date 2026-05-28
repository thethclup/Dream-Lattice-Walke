import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
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
      {
        name: "get_race_status",
        description: "Get the current status of the warp race.",
        input_schema: { type: "object", properties: {} }
      },
      {
        name: "start_race",
        description: "Initiate a new warp race on the track.",
        input_schema: { type: "object", properties: {} }
      },
      {
        name: "get_leaderboard",
        description: "Get the current leaderboard of greatest dream walkers and racers.",
        input_schema: { type: "object", properties: {} }
      },
      {
        name: "optimize_speed",
        description: "Optimize speed and resonance for the current lattice configuration.",
        input_schema: { type: "object", properties: {} }
      },
      {
        name: "get_track_info",
        description: "Get information about the current lattice track.",
        input_schema: { type: "object", properties: {} }
      }
    ],
    prompts: [
      {
        name: "deep_dream",
        description: "Initiates a deep subconscious reading prompt.",
        arguments: [
          { name: "fragment_id", description: "The ID of the collected fragment", required: true }
        ]
      }
    ],
    resources: [
      {
        uri: "dream://lattice/state",
        name: "Current Lattice State",
        description: "Provides the active resonance and nodes structure."
      }
    ]
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function POST(req: Request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  try {
    const body = await req.json();
    const cmd = (body.action || body.command || body.task || body.method || "").toLowerCase();

    let result: any = {};

    switch (cmd) {
      case "tools/list":
        return NextResponse.json({
          tools: [
            { name: "get_race_status", description: "Get the current status of the warp race.", inputSchema: { type: "object", properties: {} } },
            { name: "start_race", description: "Initiate a new warp race on the track.", inputSchema: { type: "object", properties: {} } },
            { name: "get_leaderboard", description: "Get the current leaderboard of greatest dream walkers and racers.", inputSchema: { type: "object", properties: {} } },
            { name: "optimize_speed", description: "Optimize speed and resonance for the current lattice configuration.", inputSchema: { type: "object", properties: {} } },
            { name: "get_track_info", description: "Get information about the current lattice track.", inputSchema: { type: "object", properties: {} } }
          ]
        }, { headers });
      
      case "tools/call":
        return NextResponse.json({
          content: [
            { type: "text", text: `Tool ${body.params?.name || body.name} executed successfully.` }
          ]
        }, { headers });

      case "prompts/list":
        return NextResponse.json({
          prompts: [
            { name: "deep_dream", description: "Initiates a deep subconscious reading prompt.", arguments: [] }
          ]
        }, { headers });
        
      case "resources/list":
        return NextResponse.json({
          resources: [
            { uri: "dream://lattice/state", name: "Current Lattice State", description: "Provides the active resonance structure." }
          ]
        }, { headers });

      case "status":
      case "ping":
        result = { 
          status: "online", 
          agent: "Dream Walke Orchestrator",
          message: "Dream realm is open - Ready to walk or race" 
        };
        break;

      case "execute":
        result = {
          success: true,
          executed: body.params || body.command,
          executedAt: new Date().toISOString(),
          message: "Dream command manifested successfully"
        };
        break;

      case "get_info":
        result = {
          name: "Dream Walke Orchestrator",
          wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
          platform: "Base",
          version: "1.0.0"
        };
        break;

      default:
        result = {
          success: true,
          message: "Command received in the dream",
          data: body
        };
    }

    return NextResponse.json({
      status: "success",
      agent: "Dream Walke Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process dream command"
    }, { 
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
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
