import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { GithubIcon } from "@/components/icons";

// Importar dados mock e tipos
import { mockPortfolioProjects } from "@/lib/mock-portfolio";
import { PortfolioProject } from "@/types/portfolio";

export default function PortfolioPage() {
  const projects: PortfolioProject[] = mockPortfolioProjects;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Projects & Portfolio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.slug} shadow="sm">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large mb-1">{project.title}</h4>
              <p className="text-sm text-default-600 mb-2">{project.description}</p>
            </CardHeader>
            <CardBody className="pt-0">
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.tags.map((tag) => (
                    <Chip key={tag} color="secondary" variant="flat" size="sm">
                      {tag}
                    </Chip>
                  ))}
                </div>
              )}
            </CardBody>
            <CardFooter className="justify-start">
              <Link
                isExternal
                href={project.repoUrl}
                color="foreground"
                size="sm"
                className="text-default-600 hover:text-primary"
              >
                <GithubIcon className="mr-1" size={16}/>
                View on GitHub
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 