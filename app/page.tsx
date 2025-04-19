import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Newspaper, FolderGit2 } from "lucide-react";

import { GithubIcon } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";
import { mockArticleModules } from "@/lib/mock-articles"; // Importar artigos mock
import { mockPortfolioProjects } from "@/lib/mock-portfolio"; // Importar projetos mock

export default function Home() {
  // Pegar os 2 primeiros módulos para exibir na home (exemplo)
  const latestModules = mockArticleModules.slice(0, 2);
  const latestProjects = mockPortfolioProjects.slice(0, 3); // Pegar os 3 primeiros projetos

  return (
    <section className="flex flex-col items-center justify-center gap-16 md:gap-20 py-8 md:py-10">
      {/* Espaço para Logo */}
      <div className="mb-4">
        {" "}
        {/* Adicionar margem abaixo */}
        {/* TODO: Adicionar componente <Image> do Next.js ou <img> aqui */}
        <div className="w-32 h-32 bg-default-200 dark:bg-default-100 rounded-full flex items-center justify-center text-default-500">
          (Logo)
        </div>
      </div>

      {/* Seção Hero */}
      <div className="inline-block max-w-3xl text-center justify-center">
        <h1 className={title()}>Welcome to&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>NullUnit&nbsp;</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4" })}>
          Your hub for cybersecurity knowledge sharing, CTF strategies, bug
          bounty insights, and collaborative research.
        </h2>
      </div>

      {/* Botões de Ação (Exemplo) */}
      <div className="flex gap-3">
        <Button
          as={NextLink}
          color="primary"
          href="/articles"
          size="lg"
          variant="solid"
        >
          Explore Articles
        </Button>
        <Button
          as={NextLink}
          color="primary"
          href="/about"
          size="lg"
          variant="bordered"
        >
          Learn More
        </Button>
      </div>

      {/* Seção Últimos Artigos */}
      <div className="w-full max-w-5xl">
        <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <Newspaper className="text-primary" size={24} strokeWidth={1.5} />
          Latest Articles & Tutorials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestModules.map((module) => (
            <Card key={module.slug} shadow="sm">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">{module.title}</h4>
                {module.description && (
                  <small className="text-default-500">
                    {module.description}
                  </small>
                )}
              </CardHeader>
              <CardFooter className="justify-start">
                <Link
                  as={NextLink}
                  color="primary"
                  href={`/articles/${module.slug}/${module.subArticles[0].slug}`}
                  size="sm"
                >
                  Start Reading
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        {mockArticleModules.length > 2 && (
          <div className="text-center mt-6">
            <Link showAnchorIcon as={NextLink} color="primary" href="/articles">
              View All Articles
            </Link>
          </div>
        )}
      </div>

      {/* Seção Projetos Recentes */}
      <div className="w-full max-w-5xl mb-16 md:mb-64">
        <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <FolderGit2 className="text-primary" size={24} strokeWidth={1.5} />
          Recent Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestProjects.map((project) => (
            <Card key={project.slug} shadow="sm">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large mb-1">{project.title}</h4>
                <p className="text-sm text-default-600 mb-2">
                  {project.description}
                </p>
              </CardHeader>
              <CardBody className="pt-0">
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.tags.map((tag) => (
                      <Chip
                        key={tag}
                        color="secondary"
                        size="sm"
                        variant="flat"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                )}
              </CardBody>
              <CardFooter className="justify-start">
                <Link
                  isExternal
                  className="text-default-600 hover:text-primary"
                  color="foreground"
                  href={project.repoUrl}
                  size="sm"
                >
                  <GithubIcon className="mr-1" size={16} />
                  View on GitHub
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        {mockPortfolioProjects.length > 3 && (
          <div className="text-center mt-6">
            <Link
              showAnchorIcon
              as={NextLink}
              color="primary"
              href="/portfolio"
            >
              View All Projects
            </Link>
          </div>
        )}
      </div>

      {/* TODO: Adicionar outras seções se necessário (ex: Sobre Nós Resumido, Call to Action para Discord/Sponsor) */}
    </section>
  );
}
