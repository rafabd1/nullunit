"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@heroui/link";

// Importar dados mock e tipos
import { mockPortfolioProjects } from "@/lib/mock-portfolio";
import { PortfolioProject } from "@/types/portfolio";
import { ContentCard } from "@/components/content-card";
import { FilterBar } from "@/components/filter-bar";

// Função de filtro para projetos
const filterProjects = (project: PortfolioProject, searchTerm: string, selectedTags: Set<string>): boolean => {
  // Verifica correspondência com termo de busca (garantindo retorno booleano)
  const titleMatch = project.title.toLowerCase().includes(searchTerm);
  const descriptionMatch = Boolean(project.description && project.description.toLowerCase().includes(searchTerm));
  const tagMatch = Boolean(project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
  
  const matchesSearch = searchTerm === '' || titleMatch || descriptionMatch || tagMatch;

  // Verifica correspondência com tags selecionadas
  let matchesTags = true; 
  if (selectedTags.size > 0) {
    if (!project.tags) {
      matchesTags = false;
    } else {
      matchesTags = Array.from(selectedTags).every(selectedTag => project.tags!.includes(selectedTag));
    }
  }

  // Retorna true apenas se ambas as condições forem atendidas
  return matchesSearch && matchesTags;
};

export default function PortfolioPage() {
  const allProjects = mockPortfolioProjects;
  const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>(allProjects);

  // Extrair todas as tags únicas dos projetos (memoizado)
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allProjects.forEach(project => {
      project.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [allProjects]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Our Projects & Portfolio</h1>

      {/* Barra de Filtro */}
      <FilterBar
        items={allProjects}
        filterFn={filterProjects}
        onFilterChange={setFilteredProjects}
        availableTags={availableTags}
        placeholderText="Filter projects by title, description, or tag..."
        tagColor="secondary"
      />
      
      {/* Grid para listar os projetos filtrados */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ContentCard 
              key={project.slug}
              type="project"
              slug={project.slug}
              title={project.title}
              description={project.description}
              tags={project.tags}
              href={project.repoUrl}
              linkText="View on GitHub"
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-default-500 mt-8">No projects found matching your filters.</p>
      )}
    </div>
  );
} 