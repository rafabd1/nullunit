import { Link } from "@heroui/link";
import { GithubIcon } from "@/components/icons";

// Importar dados mock e tipos
import { mockPortfolioProjects } from "@/lib/mock-portfolio";
import { PortfolioProject } from "@/types/portfolio";
import { ContentCard } from "@/components/content-card";

export default function PortfolioPage() {
  const projects: PortfolioProject[] = mockPortfolioProjects;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Projects & Portfolio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
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
    </div>
  );
} 