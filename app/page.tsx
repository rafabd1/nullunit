import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Newspaper, FolderGit2, BookMarkedIcon } from "lucide-react";

import { title, subtitle } from "@/components/primitives";
import { ContentCard } from "@/components/content-card";
import { CourseCard } from "@/components/CourseCard"; // Importar CourseCard

import { Article } from "@/types/article";
import { PortfolioProject } from "@/types/portfolio";
import { Course } from "@/types/course";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

async function getLatestArticles(limit: number = 2): Promise<Article[]> {
  try {
    // Adicionar ?limit=X se o backend suportar, caso contrário, buscar todos e fatiar
    const res = await fetch(`${API_BASE_URL}/api/articles?limit=${limit}`, { next: { revalidate: 3600 } }); // Revalidar a cada hora
    if (!res.ok) {
      console.error("Failed to fetch articles:", res.status, res.statusText);
      return [];
    }
    const articles: Article[] = await res.json();
    // Se o backend não suportar limit, fatiar aqui:
    // return articles.slice(0, limit);
    return articles; // Assumindo que o backend lida com o limite
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

async function getRecentProjects(limit: number = 3): Promise<PortfolioProject[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/portfolio?limit=${limit}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error("Failed to fetch projects:", res.status, res.statusText);
      return [];
    }
    const projects: PortfolioProject[] = await res.json();
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

async function getFeaturedCourses(limit: number = 3): Promise<Course[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/courses?limit=${limit}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error("Failed to fetch courses:", res.status, res.statusText);
      return [];
    }
    const courses: Course[] = await res.json();
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}


export default async function Home() {
  const latestArticles = await getLatestArticles(2);
  const recentProjects = await getRecentProjects(3);
  const featuredCourses = await getFeaturedCourses(3);

  return (
    <section className="flex flex-col items-center justify-center gap-16 md:gap-24 py-8 md:py-10">
      {/* Hero Section */}
      <div className="max-w-3xl text-center justify-center flex flex-col items-center">
        <div className="mb-6">
          {/* <Logo size={80} /> // Se tiver um componente Logo */}
          <div className="w-32 h-32 bg-default-200 dark:bg-default-800 rounded-full flex items-center justify-center text-default-500 dark:text-default-300 text-4xl font-bold">
            NU
          </div>
        </div>
        <h1 className={title()}>Bem-vindo à&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>NullUnit&nbsp;</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4" })}>
          Sua plataforma de aprendizado e colaboração em cibersegurança. Explore artigos, cursos e ferramentas.
        </h2>
        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          <Button as={NextLink} color="primary" href="/articles" size="lg" variant="solid">
            Explorar Artigos
          </Button>
          <Button as={NextLink} color="default" href="/courses" size="lg" variant="solid">
            Ver Cursos
          </Button>
          <Button as={NextLink} color="default" href="/portfolio" size="lg" variant="bordered">
            Nosso Portfólio
          </Button>
        </div>
      </div>

      {/* Seção Últimos Artigos */}
      {latestArticles.length > 0 && (
        <div className="w-full max-w-6xl px-4">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center flex items-center justify-center gap-2 text-foreground">
            <Newspaper className="text-primary" size={28} strokeWidth={2} />
            Artigos Recentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestArticles.map((article) => (
              <ContentCard
                key={article.id}
                type="article"
                slug={article.slug}
                title={article.title}
                description={article.description || undefined}
                tags={article.tags}
                href={`/articles/${article.slug}`}
                linkText="Ler Artigo"
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link showAnchorIcon as={NextLink} color="primary" href="/articles" className="text-lg">
              Ver todos os artigos
            </Link>
          </div>
        </div>
      )}

      {/* Seção Cursos em Destaque */}
      {featuredCourses.length > 0 && (
        <div className="w-full max-w-6xl px-4">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center flex items-center justify-center gap-2 text-foreground">
            <BookMarkedIcon className="text-primary" size={28} strokeWidth={2} />
            Cursos em Destaque
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link showAnchorIcon as={NextLink} color="primary" href="/courses" className="text-lg">
              Ver todos os cursos
            </Link>
          </div>
        </div>
      )}

      {/* Seção Projetos Recentes */}
      {recentProjects.length > 0 && (
        <div className="w-full max-w-6xl px-4 mb-16">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center flex items-center justify-center gap-2 text-foreground">
            <FolderGit2 className="text-primary" size={28} strokeWidth={2} />
            Projetos em Destaque
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <ContentCard
                key={project.id}
                type="project"
                slug={project.slug}
                title={project.title}
                description={project.description}
                tags={project.tags} // API de portfólio precisa retornar tags com 'id' e 'name'
                href={project.repo_url}
                linkText="Ver no GitHub"
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link showAnchorIcon as={NextLink} color="primary" href="/portfolio" className="text-lg">
              Ver todos os projetos
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
