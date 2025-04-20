import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Newspaper, FolderGit2 } from "lucide-react";

import { title, subtitle } from "@/components/primitives";
import { mockArticleModules } from "@/lib/mock-articles";
import { mockPortfolioProjects } from "@/lib/mock-portfolio";
import { ContentCard } from "@/components/content-card"; // Importar ContentCard

export default function Home() {
  // Pegar os 2 módulos mais recentes (ou primeiros)
  const latestModules = mockArticleModules.slice(0, 2); 
  const latestProjects = mockPortfolioProjects.slice(0, 3);

  return (
    <section className="flex flex-col items-center justify-center gap-16 md:gap-28 py-8 md:py-10">
      {/* Hero Section */}
      <div className="max-w-3xl text-center justify-center flex flex-col items-center">
        {/* Logo Placeholder */}
        <div className="mb-6">
          <div className="w-32 h-32 bg-default-200 dark:bg-default-100 rounded-full flex items-center justify-center text-default-500">
            (Logo)
          </div>
        </div>
        {/* Títulos */}
        <h1 className={title()}>Welcome to&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>NullUnit&nbsp;</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4" })}>
          Your hub for cybersecurity knowledge sharing, CTF strategies, bug
          bounty insights, and collaborative research.
        </h2>
        {/* Botões */}
        <div className="flex gap-3 mt-8">
          <Button as={NextLink} color="primary" href="/articles" size="lg" variant="solid">Explore Articles</Button>
          <Button as={NextLink} color="primary" href="/about" size="lg" variant="bordered">Learn More</Button>
        </div>
      </div>

      {/* Seção Últimos Artigos (Módulos com ContentCard) */}
      <div className="w-full max-w-5xl">
        <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <Newspaper className="text-primary" size={24} strokeWidth={1.5} />
          Latest Articles & Tutorials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestModules.map((module) => (
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
        {/* Mostrar link "View All" se houver mais módulos do que o exibido */}
        {mockArticleModules.length > latestModules.length && (
          <div className="text-center mt-6">
            <Link showAnchorIcon as={NextLink} color="primary" href="/articles">
              View All Articles
            </Link>
          </div>
        )}
      </div>

      {/* Seção Projetos Recentes (com ContentCard) */}
      <div className="w-full max-w-5xl mb-16 md:mb-64">
        <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <FolderGit2 className="text-primary" size={24} strokeWidth={1.5} />
          Recent Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestProjects.map((project) => (
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
        {/* Mostrar link "View All" se houver mais projetos do que o exibido */}
        {mockPortfolioProjects.length > latestProjects.length && (
          <div className="text-center mt-6">
            <Link showAnchorIcon as={NextLink} color="primary" href="/portfolio">
              View All Projects
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
