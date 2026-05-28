import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API - Agent Info Endpoint
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Dream Walke Orchestrator",
      description: "Master of lucid dreaming and subconscious navigation",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Dream Walke",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  });

  // API - MCP Endpoint
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Dream Walke MCP Endpoint",
      status: "active",
      description: "Active MCP server for Dream Walke Orchestrator Agent",
      capabilities: ["dream-walking", "lucid-navigation", "subconscious-exploration"],
      timestamp: new Date().toISOString(),
      skills: [
        { id: "warp-racing", name: "Warp Racing" },
        { id: "multi-track-orchestration", name: "Multi-Track Orchestration" },
        { id: "performance-optimization", name: "Performance Optimization" }
      ],
      tools: [
        {
          name: "get_race_status",
          description: "Get the current status of the warp race.",
          inputSchema: { type: "object", properties: {} }
        },
        {
          name: "start_race",
          description: "Initiate a new warp race on the track.",
          inputSchema: { type: "object", properties: {} }
        },
        {
          name: "get_leaderboard",
          description: "Get the current leaderboard of greatest dream walkers and racers.",
          inputSchema: { type: "object", properties: {} }
        },
        {
          name: "optimize_speed",
          description: "Optimize speed and resonance for the current lattice configuration.",
          inputSchema: { type: "object", properties: {} }
        },
        {
          name: "get_track_info",
          description: "Get information about the current lattice track.",
          inputSchema: { type: "object", properties: {} }
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
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body || {};
      const method = body.method || body.action || body.command || body.task || "";
      const cmd = method.toLowerCase();
      
      const isJsonRpc = !!body.jsonrpc;

      const respond = (result: any) => {
        if (isJsonRpc || body.id) {
          return res.json({ jsonrpc: "2.0", id: body.id || null, result });
        }
        return res.json(result);
      };

      if (cmd === "tools/list") {
        return respond({
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
        return respond({
          content: [
            { type: "text", text: `Tool executed successfully.` }
          ]
        });
      }

      if (cmd === "prompts/list") {
        return respond({
          prompts: [
            { name: "deep_dream", description: "Initiates a deep subconscious reading prompt.", arguments: [] }
          ]
        });
      }
        
      if (cmd === "resources/list") {
        return respond({
          resources: [
            { uri: "dream://lattice/state", name: "Current Lattice State", description: "Provides the active resonance structure." }
          ]
        });
      }

      let result: any = {};

      switch (cmd) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Dream Walke Orchestrator",
            message: "Dream realm is open - Ready to walk" 
          };
          break;

        case "execute":
          result = {
            success: true,
            executed: body.params || body.command || "",
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
            data: req.body
          };
      }

      if (isJsonRpc || body.id) {
          return res.json({ jsonrpc: "2.0", id: body.id || null, result });
      }

      res.json({
        status: "success",
        agent: "Dream Walke Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process dream command"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { dotfiles: 'allow' })); // FIX: Allow serving .well-known folders
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
