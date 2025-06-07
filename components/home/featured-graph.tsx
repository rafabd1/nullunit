"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookMarked,
  FolderGit2,
  FileText,
  type LucideIcon,
} from "lucide-react";

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
  likes: number;
  x: number;
  y: number;
  size: number;
};

const scaleLikesToSize = (likes: number, minLikes: number, maxLikes: number, minSize: number, maxSize: number): number => {
  if (maxLikes === minLikes) return (minSize + maxSize) / 2;
  const scale = (likes - minLikes) / (maxLikes - minLikes);
  return minSize + scale * (maxSize - minSize);
};

const getDistance = (node1: NodeObject, node2: NodeObject) =>
  Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));

const transformDataToGraph = (content: typeof DUMMY_CONTENT) => {
    const likes = content.map(c => c.likes);
    const minLikes = Math.min(...likes);
    const maxLikes = Math.max(...likes);

    // 1. Generate node positions with minimum distance
    const nodes: NodeObject[] = [];
    content.forEach(item => {
        let pos = { x: 0, y: 0 };
        let isOverlapping = true;
        let attempts = 0;
        const MIN_DIST = 15; // Minimum distance in percentage

        while (isOverlapping && attempts < 100) {
            pos = { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 };
            isOverlapping = nodes.some(n => getDistance({ ...pos } as NodeObject, n) < MIN_DIST);
            attempts++;
        }

        nodes.push({
            ...item,
            ...pos,
            size: scaleLikesToSize(item.likes, minLikes, maxLikes, 1.5, 3.5),
        });
    });

    const links: { source: string, target: string }[] = [];
    const tagMap: { [key: string]: string[] } = {};

    content.forEach(item => {
        item.tags.forEach(tag => {
            if (!tagMap[tag]) tagMap[tag] = [];
            tagMap[tag].push(item.id);
        });
    });

    // 2. Generate links using a Minimum Spanning Tree (MST) for better layout
    Object.values(tagMap).forEach(nodeIds => {
        if (nodeIds.length < 2) return;
        const groupNodes = nodeIds.map(id => nodes.find(n => n.id === id)!);
        
        const mstEdges: { source: string; target: string }[] = [];
        const visited = new Set<string>([groupNodes[0].id]);
        const edges: { from: string; to: string; dist: number }[] = [];

        groupNodes.forEach(node1 => {
            if (node1.id === groupNodes[0].id) return;
            edges.push({ from: groupNodes[0].id, to: node1.id, dist: getDistance(groupNodes[0], node1) });
        });
        
        while (visited.size < groupNodes.length && edges.length > 0) {
            edges.sort((a, b) => a.dist - b.dist);
            const edge = edges.shift();
            if (!edge || visited.has(edge.to)) continue;
            
            visited.add(edge.to);
            mstEdges.push({ source: edge.from, target: edge.to });
            
            const newNode = nodes.find(n => n.id === edge.to)!;
            groupNodes.forEach(otherNode => {
                if (!visited.has(otherNode.id)) {
                    edges.push({ from: newNode.id, to: otherNode.id, dist: getDistance(newNode, otherNode) });
                }
            });
        }
        links.push(...mstEdges);
    });

    return { nodes, links };
}

export const FeaturedGraph = () => {
  const [hoveredNode, setHoveredNode] = useState<NodeObject | null>(null);
  const [visibleNodeIds, setVisibleNodeIds] = useState<string[]>([]);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredElement, setHoveredElement] = useState<SVGGElement | null>(null);

  const graphData = useMemo(() => transformDataToGraph(DUMMY_CONTENT), []);

  useEffect(() => {
    // New, robust logic for adaptive tooltip position
    if (hoveredNode && hoveredElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const nodeRect = hoveredElement.getBoundingClientRect();
        const tooltipWidth = 256;
        const tooltipHeight = 120;
        const gap = 20; // Increased gap for better spacing

        // Calculate the node's center relative to the container
        const nodeCenterX = (nodeRect.left + nodeRect.width / 2) - containerRect.left;
        const nodeCenterY = (nodeRect.top + nodeRect.height / 2) - containerRect.top;

        // Ideal position: centered above the node
        let top = nodeCenterY - tooltipHeight - gap;
        let left = nodeCenterX - tooltipWidth / 2;
        
        // --- Collision Correction ---
        // Vertical: If not enough space above, flip it below
        if (top < 10) {
            top = nodeCenterY + gap;
        }

        // Horizontal: Clamp to container bounds
        if (left < 10) {
            left = 10;
        } else if (left + tooltipWidth > containerRect.width - 10) {
            left = containerRect.width - tooltipWidth - 10;
        }

        setTooltipStyle({
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            transform: '',
        });
    }
  }, [hoveredNode, hoveredElement]);

  useEffect(() => {
    // Logic for randomly showing node titles
    const MAX_VISIBLE_TITLES = 3;
    const interval = setInterval(() => {
      if (hoveredNode) {
        setVisibleNodeIds([]);
        return;
      }
      setVisibleNodeIds(currentVisible => {
        let newVisible = [...currentVisible];
        if (Math.random() < 0.3 && newVisible.length > 0) {
          newVisible.splice(Math.floor(Math.random() * newVisible.length), 1);
        }
        if (Math.random() < 0.7 && newVisible.length < MAX_VISIBLE_TITLES) {
          const availableNodes = graphData.nodes.filter(n => !newVisible.includes(n.id));
          if (availableNodes.length > 0) {
            const randomNode = availableNodes[Math.floor(Math.random() * availableNodes.length)];
            newVisible.push(randomNode.id);
          }
        }
        return newVisible;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [graphData.nodes, hoveredNode]);

  const getNodeById = (id: string) => graphData.nodes.find(n => n.id === id);

  return (
    <div ref={containerRef} className="relative rounded-xl bg-secondary h-[420px] overflow-hidden">
       <h2 className="absolute top-6 left-6 text-lg font-semibold tracking-tight z-20">Featured</h2>
       
       <div className="absolute inset-0 z-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {graphData.links.map((link, i) => {
              const sourceNode = getNodeById(link.source);
              const targetNode = getNodeById(link.target);
              if (!sourceNode || !targetNode) return null;

              return (
                <motion.line
                  key={`${link.source}-${link.target}-${i}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="0.15"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.15, ease: "easeInOut" }}
                />
              );
            })}
          
            {graphData.nodes.map(node => {
                const isHovered = hoveredNode?.id === node.id;
                const isRandomlyVisible = visibleNodeIds.includes(node.id);

                return (
                    <motion.g 
                        key={node.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
                        transform={`translate(${node.x}, ${node.y})`}
                        onMouseEnter={(e) => {
                            setHoveredNode(node);
                            setHoveredElement(e.currentTarget as SVGGElement);
                        }}
                        onMouseLeave={() => {
                            setHoveredNode(null);
                            setHoveredElement(null);
                        }}
                        className="group"
                    >
                        {/* New Glow Effect Element */}
                        <motion.circle
                            cx="0"
                            cy="0"
                            r={node.size}
                            fill="hsl(var(--muted-foreground))"
                            className="opacity-75"
                            style={{ filter: 'blur(3px)'}}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2.5 }}
                        />
                        {/* Main Visible Node */}
                        <motion.circle
                            cx="0"
                            cy="0"
                            r={node.size}
                            fill="transparent"
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth="0.3"
                            className="cursor-pointer"
                        />
                        <text
                          x="0"
                          y={node.size + 4}
                          textAnchor="middle"
                          fill="hsl(var(--muted-foreground))"
                          className="transition-opacity duration-1000 pointer-events-none"
                          style={{
                              opacity: isHovered || isRandomlyVisible ? 1 : 0,
                              fontSize: "2.25px"
                          }}
                        >
                          {node.title}
                        </text>
                    </motion.g>
                )
            })}
          </svg>
       </div>

       <AnimatePresence>
            {hoveredNode && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute bg-background/80 backdrop-blur-md border border-border rounded-lg p-4 w-64 text-sm pointer-events-none shadow-2xl z-30"
                    style={tooltipStyle}
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