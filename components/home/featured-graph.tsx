"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import OriginalForceGraph2D from "react-force-graph-2d";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  BookMarked,
  FolderGit2,
  FileText,
  type LucideIcon,
} from "lucide-react";

// Cast to a compatible type for React 18
const ForceGraph2D = OriginalForceGraph2D as any;

// No futuro, estes dados virão da sua API
const DUMMY_CONTENT = [
  { id: "c1", type: "Course" as const, slug: "adv-exploit-dev", title: "Advanced Exploit Development", description: "Deep dive into modern exploitation techniques.", likes: 85, tags: ["exploit", "reverse-engineering"] },
  { id: "a1", type: "Article" as const, slug: "rop-chains", title: "Understanding ROP Chains", description: "A detailed breakdown of Return-Oriented Programming.", likes: 120, tags: ["exploit", "memory-corruption"] },
  { id: "p1", type: "Project" as const, slug: "rootkit-detector", title: "Rootkit Detector", description: "An open-source tool to detect kernel-level rootkits.", likes: 250, tags: ["malware", "reverse-engineering"] },
  { id: "a2", type: "Article" as const, slug: "intro-malware-analysis", title: "Intro to Malware Analysis", description: "Learn the fundamentals of static and dynamic malware analysis.", likes: 95, tags: ["malware", "reverse-engineering"] },
  { id: "c2", type: "Course" as const, slug: "web-sec-fundamentals", title: "Web Security Fundamentals", description: "Covering the OWASP Top 10 and more.", likes: 150, tags: ["web", "pentesting"] },
  { id: "a3", type: "Article" as const, slug: "xss-patterns", title: "XSS Patterns and Bypasses", description: "Exploring advanced cross-site scripting vectors.", likes: 200, tags: ["web", "exploit"] },
];

const ICONS: Record<"Course" | "Article" | "Project", LucideIcon> = {
  Course: BookMarked,
  Article: FileText,
  Project: FolderGit2,
};

type NodeObject = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: "Course" | "Article" | "Project";
  val: number;
  x?: number;
  y?: number;
};

const transformDataToGraph = (content: typeof DUMMY_CONTENT) => {
    const nodes: NodeObject[] = content.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        tags: item.tags,
        type: item.type,
        val: Math.log(item.likes + 1) * 2,
    }));

    const links: { source: string, target: string }[] = [];
    const tagMap: { [key: string]: string[] } = {};

    content.forEach(item => {
        item.tags.forEach(tag => {
            if (!tagMap[tag]) tagMap[tag] = [];
            tagMap[tag].push(item.id);
        });
    });

    Object.values(tagMap).forEach(nodeIds => {
        if (nodeIds.length > 1) {
            for (let i = 0; i < nodeIds.length; i++) {
                for (let j = i + 1; j < nodeIds.length; j++) {
                    links.push({ source: nodeIds[i], target: nodeIds[j] });
                }
            }
        }
    });

    return { nodes, links };
}

export const FeaturedGraph = () => {
  const [graphData, setGraphData] = useState<{ nodes: NodeObject[], links: any[] }>({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState<NodeObject | null>(null);
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });

  const graphRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const size = useWindowSize();
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }, [size, containerRef.current]);

  useEffect(() => {
    const data = transformDataToGraph(DUMMY_CONTENT);
    setGraphData(data);
  }, []);

  const handleNodeHover = (node: NodeObject | null) => {
    setHoveredNode(node);
    if (node && graphRef.current) {
        const {x, y} = graphRef.current.graph2ScreenCoords(node.x || 0, node.y || 0);
        setPanelPosition({ x, y });
    }
  };

  const renderNode = useCallback((node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = hoveredNode && hoveredNode.id === node.id;
    const label = node.title;
    const fontSize = 12 / globalScale;
    
    // Animação de pulso para brilho e texto
    const pulse = Math.abs(Math.sin(Date.now() * 0.001 + node.val));
    
    // Desenha o nó
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, node.val + (isHovered ? 1 : 0), 0, 2 * Math.PI, false);
    const glow = isHovered ? 30 : pulse * 15;
    ctx.shadowBlur = glow;
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Desenha o texto
    if (globalScale > 1.5) { // Só mostra o texto se o zoom for suficiente
        const textAlpha = isHovered ? 1 : Math.max(0.1, pulse * 0.5);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
        ctx.font = `${fontSize}px Inter`;
        ctx.fillText(label, node.x!, node.y! + node.val + 8);
    }
  }, [hoveredNode]);

  return (
    <div ref={containerRef} className="relative rounded-xl bg-secondary h-[450px] -mx-6 -my-4 lg:-mx-8 lg:-my-6 overflow-hidden">
       <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        cooldownTicks={100}
        onEngineStop={() => graphRef.current?.zoomToFit(400, 150)}
        nodeCanvasObject={renderNode}
        onNodeHover={handleNodeHover as any}
        linkDirectionalParticles={1}
        linkDirectionalParticleColor={() => "rgba(255, 255, 255, 0.5)"}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleWidth={0.5}
        linkColor={() => "rgba(255, 255, 255, 0.1)"}
       />
       <AnimatePresence>
            {hoveredNode && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute bg-background/80 backdrop-blur-md border border-border rounded-lg p-4 w-64 text-sm pointer-events-none shadow-2xl"
                    style={{
                        top: panelPosition.y,
                        left: panelPosition.x,
                        transform: 'translate(-50%, -125%)', // Ajusta para aparecer acima do nó
                    }}
                >
                   <div className="font-bold text-base mb-2 flex items-center">
                    {React.createElement(ICONS[hoveredNode.type], { className: "w-4 h-4 mr-2 flex-shrink-0"})}
                    <span className="truncate">{hoveredNode.title}</span>
                   </div>
                   <p className="text-muted-foreground text-xs mb-3 line-clamp-3">{hoveredNode.description}</p>
                   <div className="flex flex-wrap gap-1">
                    {hoveredNode.tags.map(tag => (
                        <div key={tag} className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">{tag}</div>
                    ))}
                   </div>
                </motion.div>
            )}
       </AnimatePresence>
    </div>
  );
}; 