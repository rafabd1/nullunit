"use client";

import React, { useState, useEffect, useMemo } from "react";

// Tipos atualizados
import { PortfolioProject } from "@/types/portfolio";
import { Tag } from "@/types/tag"; // Usar o mesmo tipo Tag

import { ContentCard } from "@/components/content-card";
import { FilterBar } from "@/components/filter-bar";

// Função de filtro para projetos - ajustada para tags: Tag[]
const filterProjects = (project: PortfolioProject, searchTerm: string, selectedTags: Set<string>): boolean => {
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  const titleMatch = project.title.toLowerCase().includes(lowerSearchTerm);
  const descriptionMatch = Boolean(project.description && project.description.toLowerCase().includes(lowerSearchTerm));
  
  const projectTagNames = project.tags?.map(t => t.name.toLowerCase()) || [];
  const tagContentMatch = projectTagNames.some(tagName => tagName.includes(lowerSearchTerm));
  
  const matchesSearch = searchTerm === '' || titleMatch || descriptionMatch || tagContentMatch;

  let matchesSelectedTags = true; 
  if (selectedTags.size > 0) {
    if (!project.tags || project.tags.length === 0) {
      matchesSelectedTags = false;
    } else {
      matchesSelectedTags = Array.from(selectedTags).every(selectedTag => 
        projectTagNames.includes(selectedTag.toLowerCase())
      );
    }
  }
  return matchesSearch && matchesSelectedTags;
};

export default function PortfolioPage() {
  const [allProjects, setAllProjects] = useState<PortfolioProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrlBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrlBase}/api/portfolio`);
        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio projects: ${response.status} ${response.statusText}`);
        }
        const data: PortfolioProject[] = await response.json();
        setAllProjects(data);
        setFilteredProjects(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unknown error occurred while fetching projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Extrair todas as tags únicas dos projetos (ajustado para tags: Tag[])
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allProjects.forEach(project => {
      project.tags?.forEach(tag => tagsSet.add(tag.name)); // Usar tag.name
    });
    return Array.from(tagsSet).sort((a, b) => a.localeCompare(b));
  }, [allProjects]);

  if (isLoading) {
    return <p className="text-center text-default-500 mt-8">Loading projects...</p>;
  }

  if (error) {
    return <p className="text-center text-danger mt-8">Error: {error}</p>;
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Our Projects & Portfolio
        </h1>
        <p className="text-lg text-default-600 dark:text-default-400 mt-2">
          Explore a selection of our open-source tools, research, and notable contributions.
        </p>
      </header>

      <FilterBar
        items={allProjects}
        filterFn={filterProjects}
        onFilterChange={setFilteredProjects}
        availableTags={availableTags}
        placeholderText="Filter projects by title, description, or tag..."
        tagColor="secondary"
      />
      
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredProjects.map((project) => (
            <ContentCard
              key={project.id}
              slug={project.slug}
              title={project.title}
              description={project.description}
              tags={project.tags}
              href={project.repo_url}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-default-500 mt-8">
          {allProjects.length > 0 && filteredProjects.length === 0
            ? "No projects found matching your filters."
            : "No projects are currently listed. Check back soon!"}
        </p>
      )}
    </div>
  );
} 