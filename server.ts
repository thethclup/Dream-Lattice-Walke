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
        { id: "dream-walking", name: "Dream Walking" },
        { id: "lucid-navigation", name: "Lucid Navigation" },
        { id: "realm-orchestration", name: "Dream Realm Orchestration" }
      ],
      tools: [
        {
          name: "stabilize_lattice",
          description: "Stabilizes the current lattice layer configuration.",
          input_schema: {
            type: "object",
            properties: {
              layer: { type: "number", description: "The lattice layer depth to stabilize" }
            },
            required: ["layer"]
          }
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
      const { action, command, params, task } = req.body;
      const cmd = (action || command || task || "").toLowerCase();

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
            executed: params || command,
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
