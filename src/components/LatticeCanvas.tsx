import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

// === Physics Types & Constants ===
const DAMPING = 0.92;
const SPRING_STIFFNESS = 0.05;
const NODE_REPULSION = 2000;
const CONNECTION_DISTANCE = 150;

interface Vector2 { x: number; y: number; }
interface LatticeNode {
  id: string;
  pos: Vector2;
  vel: Vector2;
  basePos: Vector2; // Where it wants to return to
  radius: number;
  active: boolean;
  isPlayer: boolean;
}

interface Edge {
  id: string;
  n1: string;
  n2: string;
  active: boolean;
}

interface Fragment {
  id: string;
  pos: Vector2;
  collected: boolean;
  life: number;
}

// === Engine ===
class LatticeEngine {
  ctx: CanvasRenderingContext2D;
  width: number = 0;
  height: number = 0;
  
  nodes: Map<string, LatticeNode> = new Map();
  edges: Edge[] = [];
  fragments: Fragment[] = [];
  
  camera: Vector2 = { x: 0, y: 0 };
  draggedNode: string | null = null;
  dragPos: Vector2 | null = null;

  // React State Hooks
  updateScore: (d: number) => void;
  updateDepth: (d: number) => void;
  collectFragment: () => void;
  setStabilized: (s: boolean) => void;

  harmonyTarget = 5; // Connections needed to stabilize
  activeConnections = 0;

  constructor(
     ctx: CanvasRenderingContext2D,
     callbacks: { updateScore: any, updateDepth: any, collectFragment: any, setStabilized: any }
  ) {
    this.ctx = ctx;
    this.updateScore = callbacks.updateScore;
    this.updateDepth = callbacks.updateDepth;
    this.collectFragment = callbacks.collectFragment;
    this.setStabilized = callbacks.setStabilized;

    this.generateLevel(1);
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  generateLevel(depth: number) {
    this.nodes.clear();
    this.edges = [];
    this.fragments = [];
    this.activeConnections = 0;
    this.harmonyTarget = depth * 4 + 3;

    // Generate random nodes
    const nodeCount = 15 + depth * 5;
    for (let i = 0; i < nodeCount; i++) {
       const x = (Math.random() - 0.5) * 800;
       const y = (Math.random() - 0.5) * 800;
       this.nodes.set(`n_${i}`, {
          id: `n_${i}`,
          pos: { x, y },
          vel: { x: 0, y: 0 },
          basePos: { x, y },
          radius: i === 0 ? 12 : 6, // First node is "walker/player" core
          active: i === 0,
          isPlayer: i === 0
       });

       // Randomly place fragments
       if (Math.random() > 0.7) {
          this.fragments.push({
             id: `f_${i}`,
             pos: { x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 800 },
             collected: false,
             life: Math.random() * 100
             
          })
       }
    }
  }

  handlePointerDown(x: number, y: number) {
    // Convert screen to world
    const wx = x - this.width / 2 - this.camera.x;
    const wy = y - this.height / 2 - this.camera.y;

    // Find closest node
    let closestId: string | null = null;
    let minDist = 30; // touch radius

    this.nodes.forEach(n => {
       const dist = Math.hypot(n.pos.x - wx, n.pos.y - wy);
       if (dist < minDist) {
          minDist = dist;
          closestId = n.id;
       }
    });

    if (closestId) {
       this.draggedNode = closestId;
       this.dragPos = { x: wx, y: wy };
    }
  }

  handlePointerMove(x: number, y: number) {
     if (this.draggedNode) {
        const wx = x - this.width / 2 - this.camera.x;
        const wy = y - this.height / 2 - this.camera.y;
        this.dragPos = { x: wx, y: wy };
     }
  }

  handlePointerUp() {
     if (this.draggedNode) {
        // Did we drop it near another node to connect?
        const n1 = this.nodes.get(this.draggedNode);
        if (n1) {
           let closestToConnect: string | null = null;
           let minDist = 50;
           this.nodes.forEach(n2 => {
              if (n1.id !== n2.id) {
                 const dist = Math.hypot(n1.pos.x - n2.pos.x, n1.pos.y - n2.pos.y);
                 if (dist < minDist) {
                    minDist = dist;
                    closestToConnect = n2.id;
                 }
              }
           });

           if (closestToConnect) {
              const edgeExists = this.edges.find(e => 
                 (e.n1 === n1.id && e.n2 === closestToConnect) || 
                 (e.n2 === n1.id && e.n1 === closestToConnect)
              );
              
              if (!edgeExists) {
                 this.edges.push({
                    id: `${n1.id}_${closestToConnect}`,
                    n1: n1.id,
                    n2: closestToConnect,
                    active: true
                 });
                 n1.active = true;
                 const n2 = this.nodes.get(closestToConnect);
                 if(n2) n2.active = true;

                 this.updateScore(10);
                 this.activeConnections++;
                 
                 if (this.activeConnections >= this.harmonyTarget) {
                    this.setStabilized(true);
                 }
              }
           }
        }
     }
     this.draggedNode = null;
     this.dragPos = null;
  }

  update() {
    // Apply Spring forces for connected edges
    this.edges.forEach(e => {
       const n1 = this.nodes.get(e.n1);
       const n2 = this.nodes.get(e.n2);
       if (!n1 || !n2) return;

       const dx = n2.pos.x - n1.pos.x;
       const dy = n2.pos.y - n1.pos.y;
       const dist = Math.hypot(dx, dy);
       if (dist > 0) {
          const force = (dist - CONNECTION_DISTANCE) * SPRING_STIFFNESS;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          n1.vel.x += fx;
          n1.vel.y += fy;
          n2.vel.x -= fx;
          n2.vel.y -= fy;
       }
    });

    // Apply Repulsion & Base Return forces
    this.nodes.forEach(n1 => {
       // Return to base pos slightly to keep structure
       n1.vel.x += (n1.basePos.x - n1.pos.x) * 0.005;
       n1.vel.y += (n1.basePos.y - n1.pos.y) * 0.005;

       // Repel from others
       this.nodes.forEach(n2 => {
          if (n1.id === n2.id) return;
          const dx = n1.pos.x - n2.pos.x;
          const dy = n1.pos.y - n2.pos.y;
          const distSq = dx*dx + dy*dy;
          if (distSq > 0 && distSq < 40000) { // Only local repulsion
             const force = NODE_REPULSION / distSq;
             n1.vel.x += dx * force;
             n1.vel.y += dy * force;
          }
       });

       // Interactive Drag Force
       if (this.draggedNode === n1.id && this.dragPos) {
          n1.vel.x += (this.dragPos.x - n1.pos.x) * 0.2;
          n1.vel.y += (this.dragPos.y - n1.pos.y) * 0.2;
       }

       // Integration
       n1.vel.x *= DAMPING;
       n1.vel.y *= DAMPING;
       n1.pos.x += n1.vel.x;
       n1.pos.y += n1.vel.y;

       // Collect fragments (Player/Active node proximity)
       if (n1.active) {
          for (let i = this.fragments.length - 1; i >= 0; i--) {
             const f = this.fragments[i];
             if (!f.collected && Math.hypot(f.pos.x - n1.pos.x, f.pos.y - n1.pos.y) < 30) {
                f.collected = true;
                this.updateScore(50);
                this.collectFragment();
             }
          }
       }
    });

    // Camera follow player slowly
    const player = Array.from(this.nodes.values()).find(n => n.isPlayer);
    if (player) {
       this.camera.x += (-player.pos.x - this.camera.x) * 0.05;
       this.camera.y += (-player.pos.y - this.camera.y) * 0.05;
    }

    // Update particles
    this.fragments.forEach(f => f.life += 0.05);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    
    // Transform to camera
    this.ctx.translate(this.width / 2 + this.camera.x, this.height / 2 + this.camera.y);

    // Draw Edges
    this.edges.forEach(e => {
       const n1 = this.nodes.get(e.n1);
       const n2 = this.nodes.get(e.n2);
       if (!n1 || !n2) return;
       
       this.ctx.beginPath();
       this.ctx.moveTo(n1.pos.x, n1.pos.y);
       this.ctx.lineTo(n2.pos.x, n2.pos.y);
       this.ctx.strokeStyle = `rgba(165, 180, 252, ${e.active ? 0.6 : 0.2})`;
       this.ctx.lineWidth = e.active ? 2 : 1;
       this.ctx.stroke();

       // Draw connection pulses here if wanted
    });

    // Draw Fragments
    this.fragments.forEach(f => {
       if (f.collected) return;
       const glow = Math.sin(f.life) * 0.5 + 0.5;
       this.ctx.beginPath();
       this.ctx.arc(f.pos.x, f.pos.y, 3 + glow * 2, 0, Math.PI * 2);
       this.ctx.fillStyle = `rgba(232, 121, 249, ${glow * 0.8 + 0.2})`; // fuchsia-400
       this.ctx.shadowColor = 'rgba(232, 121, 249, 0.8)';
       this.ctx.shadowBlur = 10;
       this.ctx.fill();
    });
    this.ctx.shadowBlur = 0; // reset

    // Draw Nodes
    this.nodes.forEach(n => {
       this.ctx.beginPath();
       this.ctx.arc(n.pos.x, n.pos.y, n.radius, 0, Math.PI * 2);

       if (n.isPlayer) {
          this.ctx.fillStyle = '#ffffff';
          this.ctx.shadowColor = '#ffffff';
          this.ctx.shadowBlur = 15;
       } else if (n.active) {
          this.ctx.fillStyle = '#a5b4fc'; // indigo-300
          this.ctx.shadowColor = '#a5b4fc';
          this.ctx.shadowBlur = 10;
       } else {
          this.ctx.fillStyle = '#334155'; // slate-700
          this.ctx.strokeStyle = '#475569';
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
       }
       
       this.ctx.fill();
       this.ctx.shadowBlur = 0;
    });

    this.ctx.restore();
  }
}

// === React Component ===
export default function LatticeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<LatticeEngine | null>(null);

  const updateScore = useGameStore(s => s.updateScore);
  const updateDepth = useGameStore(s => s.updateDepth);
  const collectFragment = useGameStore(s => s.collectFragment);
  const setStabilized = useGameStore(s => s.setStabilized);
  const deepestLattice = useGameStore(s => s.deepestLattice);
  // Optional: watch stabilized to trigger a new layer or effects

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    engineRef.current = new LatticeEngine(ctx, {
      updateScore, updateDepth, collectFragment, setStabilized
    });

    let animationFrameId: number;

    const render = () => {
       engineRef.current?.update();
       engineRef.current?.draw();
       animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
       engineRef.current?.resize(canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
       window.removeEventListener('resize', handleResize);
       cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Sync engine when depth changes outside (if we implement a Next Level button)
  useEffect(() => {
     engineRef.current?.generateLevel(deepestLattice);
  }, [deepestLattice]);

  // Input Handling
  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    engineRef.current?.handlePointerDown(e.clientX - rect.left, e.clientY - rect.top);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    engineRef.current?.handlePointerMove(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    engineRef.current?.handlePointerUp();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 touch-none cursor-crosshair"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}
