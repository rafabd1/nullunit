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
  { id: "c3", type: "Course" as const, slug: "web-sec-fundamentals", title: "Web Security Fundamentals", description: "Covering the OWASP Top 10 and more.", likes: 150, tags: ["web", "pentesting"] },
  { id: "a4", type: "Article" as const, slug: "xss-patterns", title: "XSS Patterns and Bypasses", description: "Exploring advanced cross-site scripting vectors.", likes: 200, tags: ["web", "exploit"] },
  { id: "c4", type: "Course" as const, slug: "web-sec-fundamentals", title: "Web Security Fundamentals", description: "Covering the OWASP Top 10 and more.", likes: 150, tags: ["web", "pentesting"] },
  { id: "a5", type: "Article" as const, slug: "xss-patterns", title: "XSS Patterns and Bypasses", description: "Exploring advanced cross-site scripting vectors.", likes: 200, tags: ["web", "exploit"] },
  { id: "c5", type: "Course" as const, slug: "web-sec-fundamentals", title: "Web Security Fundamentals", description: "Covering the OWASP Top 10 and more.", likes: 150, tags: ["web", "pentesting"] },
  { id: "a6", type: "Article" as const, slug: "xss-patterns", title: "XSS Patterns and Bypasses", description: "Exploring advanced cross-site scripting vectors.", likes: 200, tags: ["web", "exploit"] },
  { id: "c6", type: "Course" as const, slug: "web-sec-fundamentals", title: "Web Security Fundamentals", description: "Covering the OWASP Top 10 and more.", likes: 150, tags: ["web", "pentesting"] },
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

const getDistance = (node1: { x: number; y: number }, node2: { x: number; y: number }) =>
  Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));

const transformDataToGraph = (content: typeof DUMMY_CONTENT, width: number, height: number) => {
    if (width === 0 || height === 0) {
        return { nodes: [], links: [] };
    }

    const likes = content.map(c => c.likes);
    const minLikes = Math.min(...likes);
    const maxLikes = Math.max(...likes);
    
    const TOP_MARGIN = 60;
    const SIDE_MARGIN = 30;
    const BOTTOM_MARGIN = 30;

    let nodes: NodeObject[] = content.map(item => ({
        ...item,
        x: Math.random() * (width - SIDE_MARGIN * 2) + SIDE_MARGIN,
        y: Math.random() * (height - TOP_MARGIN - BOTTOM_MARGIN) + TOP_MARGIN,
        size: scaleLikesToSize(item.likes, minLikes, maxLikes, 8, 22),
    }));

    const SIMULATION_ITERATIONS = 250;
    const K_REPULSION = 0.02;     // Tuned for pixel-space: much lower force
    const K_CENTERING = 0.00005;  // Tuned for pixel-space: much lower force
    const MIN_DIST = Math.min(width, height) * 0.3; // Responsive minimum distance

    for (let i = 0; i < SIMULATION_ITERATIONS; i++) {
        nodes.forEach((nodeA) => {
            let totalForceX = 0;
            let totalForceY = 0;

            nodes.forEach((nodeB) => {
                if (nodeA.id === nodeB.id) return;
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                let distance = getDistance(nodeA, nodeB);
                distance = distance < 1 ? 1 : distance;
                if (distance < MIN_DIST) {
                    const force = K_REPULSION * (MIN_DIST - distance) / distance;
                    totalForceX += dx * force;
                    totalForceY += dy * force;
                }
            });
            
            const centerDx = width / 2 - nodeA.x;
            const centerDy = height / 2 - nodeA.y;
            totalForceX += centerDx * K_CENTERING;
            totalForceY += centerDy * K_CENTERING;

            nodeA.x += totalForceX * 0.1; // Apply forces with damping
            nodeA.y += totalForceY * 0.1; // Apply forces with damping

            const hMargin = nodeA.size + SIDE_MARGIN;
            const vMarginTop = nodeA.size + TOP_MARGIN;
            const vMarginBottom = nodeA.size + BOTTOM_MARGIN;
            nodeA.x = Math.max(hMargin, Math.min(width - hMargin, nodeA.x));
            nodeA.y = Math.max(vMarginTop, Math.min(height - vMarginBottom, nodeA.y));
        });
    }

    const allEdges: { source: string; target: string; dist: number }[] = [];
    const tagMap: { [key: string]: string[] } = {};

    content.forEach(item => {
        item.tags.forEach(tag => {
            if (!tagMap[tag]) tagMap[tag] = [];
            tagMap[tag].push(item.id);
        });
    });

    Object.values(tagMap).forEach(nodeIds => {
        if (nodeIds.length < 2) return;
        for (let i = 0; i < nodeIds.length; i++) {
            for (let j = i + 1; j < nodeIds.length; j++) {
                const nodeA = nodes.find(n => n.id === nodeIds[i])!;
                const nodeB = nodes.find(n => n.id === nodeIds[j])!;
                 if (!allEdges.some(e => (e.source === nodeB.id && e.target === nodeA.id))) {
                    allEdges.push({
                        source: nodeA.id,
                        target: nodeB.id,
                        dist: getDistance(nodeA, nodeB)
                    });
                }
            }
        }
    });

    allEdges.sort((a, b) => a.dist - b.dist);
    
    const parent: { [key:string]: string } = {};
    const findSet = (id: string): string => {
        if (parent[id] === id) return id;
        return parent[id] = findSet(parent[id]);
    };
    const uniteSets = (a: string, b: string) => {
        a = findSet(a);
        b = findSet(b);
        if (a !== b) parent[b] = a;
    };

    nodes.forEach(node => { parent[node.id] = node.id; });
    
    const links: { source: string, target: string }[] = [];
    allEdges.forEach(edge => {
        if (findSet(edge.source) !== findSet(edge.target)) {
            links.push({ source: edge.source, target: edge.target });
            uniteSets(edge.source, edge.target);
        }
    });

    return { nodes, links };
}

export const FeaturedGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<NodeObject | null>(null);
  const [visibleNodeIds, setVisibleNodeIds] = useState<string[]>([]);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [hoveredElement, setHoveredElement] = useState<SVGGElement | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries && entries.length > 0 && entries[0].contentRect) {
        setDimensions({ 
          width: entries[0].contentRect.width, 
          height: entries[0].contentRect.height 
        });
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  const graphData = useMemo(() => {
    return transformDataToGraph(DUMMY_CONTENT, dimensions.width, dimensions.height);
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    if (hoveredNode && hoveredElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const nodeRect = hoveredElement.getBoundingClientRect();
        const tooltipWidth = 256;
        const tooltipHeight = 120;
        const gap = 15;

        const nodeCenterX = (nodeRect.left + nodeRect.width / 2) - containerRect.left;
        const nodeTopEdge = nodeRect.top - containerRect.top;
        const nodeBottomEdge = nodeRect.bottom - containerRect.top;
        
        let top = nodeTopEdge - tooltipHeight - gap;
        let left = nodeCenterX - tooltipWidth / 2;
        
        if (top < 10) {
            top = nodeBottomEdge + gap;
        }
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
  }, [hoveredNode, hoveredElement, dimensions.width]);

  useEffect(() => {
    const MAX_VISIBLE_TITLES = Math.floor(dimensions.width / 300);
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
  }, [graphData.nodes, hoveredNode, dimensions.width]);

  const getNodeById = (id: string) => graphData.nodes.find(n => n.id === id);

  return (
    <div ref={containerRef} className="relative w-full rounded-xl bg-secondary h-[450px] overflow-hidden">
       <h2 className="absolute top-6 left-6 text-lg font-semibold tracking-tight z-20">Featured</h2>
       
       <div className="absolute inset-0 z-10">
          {dimensions.width > 0 && (
            <svg width="100%" height="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
              <defs>
                  <filter id="glow-filter" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  </filter>
              </defs>

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
                    strokeWidth="1"
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
                          initial={{
                            opacity: 0,
                            scale: 0.5,
                            x: dimensions.width / 2,
                            y: dimensions.height / 2
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            x: node.x,
                            y: node.y
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 50,
                            damping: 15,
                            mass: 1,
                            delay: Math.random() * 0.2
                          }}
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
                         <motion.circle
                             cx="0"
                             cy="0"
                             r={node.size}
                             fill="transparent"
                             stroke="hsl(var(--foreground))"
                             strokeWidth="2"
                             filter="url(#glow-filter)"
                             className="pointer-events-none"
                             animate={{
                                 opacity: isHovered ? 0.9 : [0.2, 0.7]
                             }}
                             transition={{
                                 opacity: isHovered 
                                 ? { ease: 'easeOut', duration: 0.2 } 
                                 : {
                                     duration: 2.5,
                                     repeat: Infinity,
                                     repeatType: 'mirror',
                                     ease: 'easeInOut',
                                     delay: Math.random() * 2.5
                                 }
                             }}
                         />
  
                          <motion.circle
                              cx="0"
                              cy="0"
                              r={node.size}
                              fill="hsl(var(--secondary))"
                              stroke="hsl(var(--muted-foreground))"
                              className="cursor-pointer"
                              animate={{
                                  stroke: isHovered
                                      ? "hsl(var(--foreground))"
                                      : "hsl(var(--muted-foreground))",
                                  strokeWidth: isHovered ? 1.5 : 1,
                              }}
                              transition={{
                                  duration: 0.2, 
                                  ease: 'easeOut',
                              }}
                          />
                          <text
                            x="0"
                            y={node.size + 14}
                            textAnchor="middle"
                            fill="hsl(var(--muted-foreground))"
                            className="transition-opacity duration-1000 pointer-events-none"
                            style={{
                                opacity: isHovered || isRandomlyVisible ? 1 : 0,
                                fontSize: "12px"
                            }}
                          >
                            {node.title}
                          </text>
                      </motion.g>
                  )
              })}
            </svg>
          )}
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