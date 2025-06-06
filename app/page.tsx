import { type ReactElement } from "react";
import NextLink from 'next/link';
import { HeroSection } from "@/components/home/hero-section";
import { siteConfig } from "@/config/site";
import { FeaturedGraphLoader } from "@/components/home/featured-graph-loader";

interface ContentItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  tags?: { name: string; slug: string }[];
  repo_url?: string;
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

  const contentSections = [
    {
      title: "Articles",
      items: articles,
      basePath: "/articles",
    },
    {
      title: "Courses",
      items: courses,
      basePath: "/courses",
    },
    {
      title: "Projects",
      items: projects,
      basePath: "/portfolio",
    },
  ];

  return (
    <div className="space-y-20">
      <HeroSection />

      <section>
        <h2 className="mb-6 text-sm font-medium text-muted-foreground">
          Featured
        </h2>
        <FeaturedGraphLoader />
      </section>

      <section className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
        {contentSections.map((section) => (
          <ContentList
            key={section.title}
            title={section.title}
            items={section.items}
            basePath={section.basePath}
          />
        ))}
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
    <div className="flex flex-col gap-4 text-center md:text-left">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <ul className="flex flex-col gap-3 list-disc list-inside">
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
