import { type ReactElement } from "react";
import NextLink from 'next/link';
import { FeaturedCardSmall, FeaturedCardLarge } from "@/components/cards/featured-card";
import { HeroSection } from "@/components/home/hero-section";
import { siteConfig } from "@/config/site";

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

  const featuredCourse = courses.length > 0 ? courses[0] : null;
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const featuredProject = projects.length > 0 ? projects[0] : null;


  return (
    <div className="space-y-20">
      <HeroSection />

      <section>
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Featured
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
             <FeaturedCardLarge
                tag="Course"
                title={featuredCourse?.title || "Intro to Exploitation"}
                href={featuredCourse ? `/courses/${featuredCourse.slug}` : "#"}
             />
          </div>
          <div className="flex flex-col gap-6">
            <FeaturedCardSmall
                tag="Project"
                title={featuredProject?.title || "Network Security Tools"}
                href={featuredProject ? `/portfolio/${featuredProject.slug}` : "#"}
            />
            <FeaturedCardSmall
                tag="Article"
                title={featuredArticle?.title || "Docker Fundamentals"}
                href={featuredArticle ? `/articles/${featuredArticle.slug}` : "#"}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
        <ContentList
          title="Articles"
          items={articles}
          basePath="/articles"
        />
        <ContentList
          title="Courses"
          items={courses}
          basePath="/courses"
        />
        <ContentList
          title="Projects"
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
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <ul className="flex flex-col gap-3">
        {items.length > 0 ? (
          items.slice(0, 5).map((item) => (
            <li key={item.id}>
              <NextLink
                className="text-muted-foreground transition-colors hover:text-foreground"
                href={`${basePath}/${item.slug}`}
              >
                {item.title}
              </NextLink>
            </li>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No items found.</p>
        )}
      </ul>
    </div>
  );
}
