"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookMarked,
  FolderGit2,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { type Article } from "@/types/article";
import { type Course } from "@/types/course";
import { type PortfolioProject } from "@/types/portfolio";
import { type Tag } from "@/types/tag";

// A clean, unified type for content used within this component's logic.
// This ensures all required properties are present and correctly typed.
interface GraphContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  repo_url?: string;
  type: "Article" | "Course" | "Project";
  likes: number;
  tags: Tag[];
}

const ICONS: Record<"Article" | "Course" | "Project", LucideIcon> = {
  Course: BookMarked,
  Article: FileText,
  Project: FolderGit2,
};

type NodeObject = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: "Article" | "Course" | "Project";
  likes: number;
  x: number;
  y: number;
  size: number;
  slug: string;
  repo_url?: string;
};

const scaleLikesToSize = (likes: number, minLikes: number, maxLikes: number, minSize: number, maxSize: number): number => {
  if (maxLikes === minLikes) return (minSize + maxSize) / 2;
  const scale = (likes - minLikes) / (maxLikes - minLikes);
  return minSize + scale * (maxSize - minSize);
};

const getDistance = (node1: { x: number; y: number }, node2: { x: number; y: number }) =>
  Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));

// --- Line Intersection Helpers ---

const onSegment = (p: {x:number, y:number}, q: {x:number, y:number}, r: {x:number, y:number}) => {
    return (
        q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)
    );
};

const orientation = (p: {x:number, y:number}, q: {x:number, y:number}, r: {x:number, y:number}) => {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0;
    return val > 0 ? 1 : 2;
};

const doLineSegmentsIntersect = (p1: {x:number, y:number}, q1: {x:number, y:number}, p2: {x:number, y:number}, q2: {x:number, y:number}) => {
    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) {
        return true;
    }

    // Special Cases for collinear points
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    return false;
};

const transformDataToGraph = (content: GraphContent[], width: number, height: number) => {
    if (width === 0 || height === 0 || content.length === 0) {
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
        // This is now safe because the `tags` property is guaranteed to be an array.
        tags: item.tags.map(tag => tag.name),
        x: Math.random() * (width - SIDE_MARGIN * 2) + SIDE_MARGIN,
        y: Math.random() * (height - TOP_MARGIN - BOTTOM_MARGIN) + TOP_MARGIN,
        size: scaleLikesToSize(item.likes, minLikes, maxLikes, 2, 9),
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
    // Create edges between all possible pairs of nodes, regardless of tags.
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const nodeA = nodes[i];
            const nodeB = nodes[j];
            allEdges.push({
                source: nodeA.id,
                target: nodeB.id,
                dist: getDistance(nodeA, nodeB),
            });
        }
    }

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
    const getNodeById = (id: string) => nodes.find(n => n.id === id)!;

    allEdges.forEach(edge => {
        if (findSet(edge.source) !== findSet(edge.target)) {
            const s1 = getNodeById(edge.source);
            const t1 = getNodeById(edge.target);
            
            let intersects = false;
            for (const existingLink of links) {
                const s2 = getNodeById(existingLink.source);
                const t2 = getNodeById(existingLink.target);
                
                // If the segments share an endpoint, they can't "cross" in a problematic way.
                if (s1.id === s2.id || s1.id === t2.id || t1.id === s2.id || t1.id === t2.id) {
                    continue;
                }
                
                if (doLineSegmentsIntersect(s1, t1, s2, t2)) {
                    intersects = true;
                    break;
                }
            }
            
            if (!intersects) {
                links.push({ source: edge.source, target: edge.target });
                uniteSets(edge.source, edge.target);
            }
        }
    });

    return { nodes, links };
}

export const FeaturedGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [content, setContent] = useState<GraphContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the calculated graph data
  const [graphData, setGraphData] = useState<{ nodes: NodeObject[], links: { source: string, target: string }[] }>({ nodes: [], links: [] });

  const [hoveredNode, setHoveredNode] = useState<NodeObject | null>(null);
  const [visibleNodeIds, setVisibleNodeIds] = useState<string[]>([]);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [hoveredElement, setHoveredElement] = useState<SVGGElement | null>(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [articlesRes, coursesRes, projectsRes] = await Promise.all([
          apiFetch("/articles"),
          apiFetch("/courses"),
          apiFetch("/portfolio"),
        ]);

        if (!articlesRes.ok || !coursesRes.ok || !projectsRes.ok) {
          throw new Error("Failed to fetch one or more content types.");
        }

        const articles: Article[] = await articlesRes.json();
        const courses: Course[] = await coursesRes.json();
        const projects: PortfolioProject[] = await projectsRes.json();

        const allContent: (Article | Course | PortfolioProject)[] = [...articles, ...courses, ...projects];

        const processedContent: GraphContent[] = allContent.map(item => {
            let type: "Article" | "Course" | "Project";
            if ('repo_url' in item) type = 'Project';
            else if ('is_paid' in item) type = 'Course';
            else type = 'Article';

            return {
                ...item,
                type: type,
                likes: (item as any).likes || 0,
                description: item.description || "",
                tags: item.tags || [],
            };
        });

        const featuredContent = processedContent
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 9);

        console.log(featuredContent);
        setContent(featuredContent);
      } catch (err: any) {
        console.error("Failed to fetch featured content:", err);
        setError("Could not load featured content.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedContent();
  }, []);
  
  // This effect now triggers the graph calculation *after* content is loaded and the container is available.
  useEffect(() => {
    // Only proceed if we have content and a container with a measurable size.
    if (content.length > 0 && containerRef.current && containerRef.current.offsetWidth > 0) {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      
      // Update dimensions state if it's not already set correctly.
      if (dimensions.width !== width || dimensions.height !== height) {
        setDimensions({ width, height });
      }

      const newGraphData = transformDataToGraph(content, width, height);
      setGraphData(newGraphData);
    }
  }, [content]); // This effect depends ONLY on content.

  // This effect handles responsive resizing *after* the initial layout is done.
  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef) return;
    
    const observer = new ResizeObserver(entries => {
      // Only proceed if there's content to re-calculate for.
      if (content.length > 0 && entries && entries.length > 0 && entries[0].contentRect) {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
          const newGraphData = transformDataToGraph(content, width, height);
          setGraphData(newGraphData);
        }
      }
    });
    observer.observe(currentRef);
    
    return () => {
      observer.unobserve(currentRef);
    };
  }, [content]); // Re-attach observer logic if content changes.

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
    const MAX_VISIBLE_TITLES = 4;
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
    }, 1000);
    return () => clearInterval(interval);
  }, [graphData.nodes, hoveredNode, dimensions.width]);

  const getNodeById = (id: string) => graphData.nodes.find(n => n.id === id);

  const handleNodeClick = (node: NodeObject) => {
    if (node.type === "Project" && node.repo_url) {
      window.open(node.repo_url, "_blank", "noopener,noreferrer");
    } else {
      const path = `/${node.type.toLowerCase()}s/${node.slug}`;
      router.push(path);
    }
  };

  if (error) {
    return (
      <div className="relative flex h-[450px] w-full items-center justify-center rounded-xl bg-secondary text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // The loading state from the dynamic import will cover the initial load.
  // This check is for when the component is mounted but data is still fetching.
  if (isLoading && content.length === 0) {
    return null; // Or a more specific loading indicator if desired
  }

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
                          onClick={() => handleNodeClick(node)}
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