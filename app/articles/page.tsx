"use client";

/* eslint-disable prettier/prettier */
import React, { useState, useMemo } from "react"; // Importar React hooks
import { Link } from "@heroui/link";

// Importar os dados mock e tipos
import { mockArticleModules } from "@/lib/mock-articles";
import { ArticleModule } from "@/types/article"; // Importar tipo ArticleModule
import { ContentCard } from "@/components/content-card"; // Importar ContentCard
import { FilterBar } from "@/components/filter-bar"; // Importar FilterBar

// Função de filtro para módulos de artigos (correção final linter)
const filterArticleModules = (module: ArticleModule, searchTerm: string, selectedTags: Set<string>): boolean => {
  // Verifica correspondência com termo de busca (garantindo retorno booleano)
  const titleMatch = module.title.toLowerCase().includes(searchTerm);
  const descriptionMatch = Boolean(module.description && module.description.toLowerCase().includes(searchTerm));
  const tagMatch = Boolean(module.tags && module.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
  
  const matchesSearch = searchTerm === '' || titleMatch || descriptionMatch || tagMatch;

  // Verifica correspondência com tags selecionadas
  let matchesTags = true; // Assume true se não houver tags selecionadas
  if (selectedTags.size > 0) {
    if (!module.tags) { // Se o módulo não tem tags, não pode corresponder
      matchesTags = false;
    } else {
      // Verifica se TODAS as tags selecionadas estão nas tags do módulo
      matchesTags = Array.from(selectedTags).every(selectedTag => module.tags!.includes(selectedTag));
    }
  }

  // Retorna true apenas se ambas as condições forem atendidas
  return matchesSearch && matchesTags;
};

export default function ArticlesPage() {
  const allModules = mockArticleModules; 

  // Estado para os módulos filtrados
  const [filteredModules, setFilteredModules] = useState<ArticleModule[]>(allModules);

  // Extrair todas as tags únicas dos módulos (memoizado)
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allModules.forEach(module => {
      module.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [allModules]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Articles & Write-Ups</h1>
      
      {/* Barra de Filtro */}
      <FilterBar
        items={allModules}
        filterFn={filterArticleModules}
        onFilterChange={setFilteredModules}
        availableTags={availableTags}
        placeholderText="Filter articles by title, description, or tag..."
        tagColor="primary"
      />

      {/* Grid para listar os módulos de artigos filtrados */}
      {filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <ContentCard 
              key={module.slug} 
              type="article"
              slug={module.slug}
              title={module.title}
              description={module.description}
              tags={module.tags} 
              href={`/articles/${module.slug}/${module.subArticles[0].slug}`}
              linkText="Start Reading"
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-default-500 mt-8">No articles found matching your filters.</p>
      )}
    </div>
  );
} 