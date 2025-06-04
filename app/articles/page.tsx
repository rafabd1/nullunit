"use client";

/* eslint-disable prettier/prettier */
import React, { useState, useMemo, useEffect } from "react";
import { Link as HerouiLink } from "@heroui/link"; // Renomeado para evitar conflito com NextLink se usado

// Importar os novos tipos Article e Tag
import { Article, Tag } from "@/types/article"; 
import { ContentCard } from "@/components/content-card"; 
import { FilterBar } from "@/components/filter-bar"; 

// Função de filtro para Artigos
const filterArticles = (article: Article, searchTerm: string, selectedTags: Set<string>): boolean => {
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  const titleMatch = article.title.toLowerCase().includes(lowerSearchTerm);
  const descriptionMatch = Boolean(article.description && article.description.toLowerCase().includes(lowerSearchTerm));
  
  // Verifica se alguma tag do artigo (pelo nome) está no termo de busca OU se o nome da tag em si é parte do termo de busca
  const articleTagsNames = article.tags?.map(t => t.name.toLowerCase()) || [];
  const tagContentMatch = articleTagsNames.some(tagName => tagName.includes(lowerSearchTerm));
  
  const matchesSearch = searchTerm === '' || titleMatch || descriptionMatch || tagContentMatch;

  // Verifica correspondência com tags selecionadas (pelos nomes das tags)
  let matchesSelectedTags = true; 
  if (selectedTags.size > 0) {
    if (!article.tags || article.tags.length === 0) {
      matchesSelectedTags = false;
    } else {
      matchesSelectedTags = Array.from(selectedTags).every(selectedTag => 
        articleTagsNames.includes(selectedTag.toLowerCase())
      );
    }
  }
  return matchesSearch && matchesSelectedTags;
};

export default function ArticlesPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrlBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrlBase}/api/articles`);
        if (!response.ok) {
          throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
        }
        const data: Article[] = await response.json();
        setAllArticles(data);
        setFilteredArticles(data); // Inicialmente, mostrar todos
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unknown error occurred while fetching articles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Extrair todas as tags únicas dos artigos (memoizado)
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allArticles.forEach(article => {
      article.tags?.forEach(tag => tagsSet.add(tag.name)); // Usar tag.name
    });
    return Array.from(tagsSet).sort((a,b) => a.localeCompare(b));
  }, [allArticles]);

  if (isLoading) {
    return <p className="text-center text-default-500 mt-8">Loading articles...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Articles & Write-Ups</h1>
      
      <FilterBar
        items={allArticles} // Passar todos os artigos para a FilterBar poder filtrar
        filterFn={filterArticles}
        onFilterChange={setFilteredArticles} // Atualizar o estado dos artigos filtrados
        availableTags={availableTags} // Passar os nomes das tags disponíveis
        placeholderText="Filter articles by title, description, or tag..."
        tagColor="primary"
      />

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredArticles.map((article) => (
            <ContentCard 
              key={article.id} 
              type="article"
              slug={article.slug} // slug do artigo
              title={article.title}
              description={article.description || undefined} // Garantir que é string ou undefined
              tags={article.tags} // Passar o array de objetos Tag
              href={`/articles/${article.slug}`} // Link direto para o artigo
              linkText="Read Article"
              // image_url={article.image_url} // Se existir um campo para imagem no futuro
              // author_name={article.author?.name} // Se tiver dados do autor
              // published_at={article.created_at} // Passar data para o card
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-default-500 mt-8">No articles found matching your filters, or no articles available.</p>
      )}
    </div>
  );
} 