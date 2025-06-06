import { type ReactElement } from "react";
import NextLink from 'next/link';
import { FeaturedCard } from "@/components/cards/featured-card";

interface ContentItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchContent(endpoint: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`Failed to fetch ${endpoint}: ${res.statusText}`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

export default async function HomePage(): Promise<ReactElement> {
  const [articles, courses, projects] = await Promise.all([
    fetchContent("articles"),
    fetchContent("courses"),
    fetchContent("portfolio"),
  ]);

  const featuredCourses = courses.slice(0, 2);
  const featuredArticle = articles.length > 0 ? articles[0] : null;

  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <section className="mb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Atividade Recente</h1>
          <p className="text-muted-foreground">
            Conteúdo novo e em destaque pela comunidade.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <FeaturedCard
              tag="Artigo em Destaque"
              title={featuredArticle?.title || "Nenhum artigo encontrado"}
              description={featuredArticle?.description || ""}
              href={featuredArticle ? `/articles/${featuredArticle.slug}` : "#"}
            />
          </div>
          <div className="flex flex-col gap-4">
            {featuredCourses.map((course) => (
              <FeaturedCard
                key={course.id}
                tag="Curso"
                title={course.title}
                description={course.description}
                href={`/courses/${course.slug}`}
              />
            ))}
             {featuredCourses.length === 0 && (
              <FeaturedCard
                tag="Curso"
                title="Nenhum curso encontrado"
                description="Volte mais tarde para ver os novos cursos."
                href="#"
              />
            )}
            {featuredCourses.length === 1 && (
               <FeaturedCard
                tag="Curso"
                title="Aguardando mais cursos..."
                description="Apenas um curso disponível no momento."
                href="#"
              />
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
        <ContentList
          title="Novos Artigos"
          items={articles}
          basePath="/articles"
        />
        <ContentList
          title="Novos Cursos"
          items={courses}
          basePath="/courses"
        />
        <ContentList
          title="Novos Projetos"
          items={projects}
          basePath="/portfolio"
        />
      </section>
    </div>
  );
}

function ContentList({
  title,
  items,
  basePath,
}: {
  title: string;
  items: ContentItem[];
  basePath: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <ul className="flex flex-col">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="border-b border-default-100 py-3">
              <NextLink
                className="text-foreground transition-colors hover:text-primary"
                href={`${basePath}/${item.slug}`}
              >
                {item.title}
              </NextLink>
            </li>
          ))
        ) : (
          <p className="text-muted-foreground">Nenhum item encontrado.</p>
        )}
      </ul>
    </div>
  );
}
