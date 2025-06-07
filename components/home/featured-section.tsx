"use client";

import { useState, useEffect } from "react";
import { FeaturedCarousel } from "./featured-carousel";
import { FeaturedGraph, type GraphContent } from "./featured-graph";
import { apiFetch } from "@/lib/api";
import { type Article } from "@/types/article";
import { type Course } from "@/types/course";
import { type PortfolioProject } from "@/types/portfolio";

export const FeaturedSection = () => {
  const [content, setContent] = useState<GraphContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const allContent = [...articles, ...courses, ...projects];

        const processedContent: GraphContent[] = allContent.map((item) => {
          let type: "Article" | "Course" | "Project";
          if ("repo_url" in item) type = "Project";
          else if ("is_paid" in item) type = "Course";
          else type = "Article";

          return {
            id: item.id,
            slug: item.slug,
            title: item.title,
            description: item.description || "",
            repo_url: (item as any).repo_url,
            type: type,
            likes: (item as any).likes || 0,
            tags: item.tags || [],
          };
        });

        const featuredContent = processedContent
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 9);

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

  if (isLoading) {
    return <div className="h-[450px] w-full rounded-xl bg-secondary" />;
  }

  if (error) {
    return (
      <div className="flex h-[450px] w-full items-center justify-center rounded-xl bg-secondary text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl bg-secondary p-6">
        <h2 className="absolute top-6 left-6 text-lg font-semibold tracking-tight z-20">Featured</h2>
        <div className="grid h-full grid-cols-1 gap-8 md:grid-cols-2">
            <div className="w-full">
                <FeaturedCarousel content={content} />
            </div>
            <div className="relative w-full">
                <div className="absolute -left-4 top-0 h-full w-px bg-border" />
                <FeaturedGraph content={content} />
            </div>
        </div>
    </div>
  );
}; 