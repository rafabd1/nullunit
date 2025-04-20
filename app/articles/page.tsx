/* eslint-disable prettier/prettier */
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Link } from "@heroui/link";
import NextLink from "next/link";

// Importar os dados mock
import { mockArticleModules } from "@/lib/mock-articles";

export default function ArticlesPage() {
  const modules = mockArticleModules; // Usar os dados mock

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Articles & Tutorials</h1>
      
      {/* Grid para listar os módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.slug} shadow="sm">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">{module.title}</h4>
              {module.description && (
                <small className="text-default-500">{module.description}</small>
              )}
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              {/* Poderíamos mostrar uma imagem ou ícone aqui se tivéssemos */}
            </CardBody>
            <CardFooter className="justify-start">
              {/* Link para o primeiro sub-artigo do módulo */}
              <Link
                as={NextLink}
                color="primary"
                href={`/articles/${module.slug}/${module.subArticles[0].slug}`}
              >
                Start Reading
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 