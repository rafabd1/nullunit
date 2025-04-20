/* eslint-disable prettier/prettier */
import { Link } from "@heroui/link";
import NextLink from "next/link";

// Importar os dados mock
import { mockArticleModules } from "@/lib/mock-articles";
import { ContentCard } from "@/components/content-card"; // Importar ContentCard

export default function ArticlesPage() {
  const modules = mockArticleModules; // Usar os módulos diretamente

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Articles & Tutorials</h1>
      
      {/* Grid para listar os módulos de artigos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ContentCard 
            key={module.slug} 
            type="article"
            slug={module.slug}
            title={module.title}
            description={module.description}
            tags={module.tags} // Usando as tags do módulo
            href={`/articles/${module.slug}/${module.subArticles[0].slug}`} // Link para o primeiro sub-artigo
            linkText="Start Reading"
          />
        ))}
      </div>
    </div>
  );
} 