# Dream Lattice Walker

**Dream Lattice Walker** is a serene, hypnotic, and mind-expanding puzzle-exploration game built for the modern web. You play as a **Lattice Walker**, wandering through infinite, glowing dream lattices — vast geometric structures made of light and memory. Walk across the lattice, reshape its structure, and discover hidden dream fragments while maintaining the delicate balance of the dream world.

## Core Features & Mechanics
- **Hypnotic Exploration**: Top-down exploration with smooth, fluid interactions to let you drift gracefully through the dream space.
- **Lattice Resonance**: Connecting nodes in harmonious geometric patterns creates powerful chain reactions that bring the lattice to life.
- **Subconscious Layers**: Shift between multiple overlapping lattice layers (physical, emotional, abstract) to discover different paths and memories.
- **Trustless Ecosystem**: Powered conceptually by dynamic Orchestrator logic to adapt the puzzles to your resonance style.

## Tech Stack
- Frontend: React + Vite, Tailwind CSS, HTML5 Canvas with fluid particle physics, Framer Motion
- Blockchain Context: Base Mainnet integrations (ERC-8004/ERC-8021 standards capabilities).
- Agent Integration: Fully EIP-8004 compliant Agent endpoints built utilizing the Next.js App Router.

## Agent Orchestrator & MCP Connection
This project hosts the **Dream Walke Orchestrator**, a fully compliant ERC-8004 AI Agent supporting Model Context Protocol (MCP) integrations.

**Agent Details:**
- **App Name/Agent**: Dream Walke Orchestrator
- **Registered Base Wallet**: `0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6`
- **Capabilities**: `dream-walking`, `lucid-navigation`, `subconscious-exploration`, `dream-realm-orchestration`

### Connecting the Agent
The platform is accessible via standard EIP-8004 endpoints:
- **Agent Card**: `/.well-known/agent-card.json`
- **Agent Protocol**: `/api/agent`
- **MCP Endpoints**: `/api/mcp`

The MCP API enables A2A (Agent-to-Agent) communication and direct tool execution, including commands for lattice stabilization, reading subconscious memories, and tracking resonance scores. 

---

## How to Run Locally

If you wish to run the graphical exploration frontend locally:

1. Clone the repository to your local machine.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the developmental server:
   ```bash
   npm run dev
   ```
4. Enter the dream locally at `http://localhost:3000`

---
> Note: Sensible values requiring authentication (like `GEMINI_API_KEY`, `APP_URL`, or `[PLACEHOLDER]` builder attributes) must be configured securely in your deployment environment variables and not pushed to version control.

