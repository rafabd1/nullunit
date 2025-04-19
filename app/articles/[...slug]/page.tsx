import { mockArticleModules } from "@/lib/mock-articles";
import { ArticleModule, SubArticle } from "@/types/article";
import { notFound } from 'next/navigation';
import NextLink from 'next/link';
import { Link } from '@heroui/link';
import clsx from 'clsx';

// Importar ReactMarkdown e o plugin GFM
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Função para buscar os dados (simulando busca)
async function getArticleData(params: { slug: string[] }): Promise<{
  module: ArticleModule | undefined;
  subArticle: SubArticle | undefined;
  moduleSlug: string;
  subArticleSlug: string;
}> {
  const [moduleSlug, subArticleSlug] = params.slug || [];
  const module = mockArticleModules.find((m) => m.slug === moduleSlug);
  const subArticle = module?.subArticles.find((sa) => sa.slug === subArticleSlug);

  return { module, subArticle, moduleSlug, subArticleSlug };
}

export default async function ArticlePage({ params }: { params: { slug: string[] } }) {
  const { module, subArticle, moduleSlug, subArticleSlug } = await getArticleData(params);

  // Se módulo ou sub-artigo não for encontrado, mostrar página 404
  if (!module || !subArticle) {
    notFound();
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar (Navegação do Módulo) */}
      <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
        <h3 className="text-lg font-semibold mb-4">{module.title}</h3>
        <nav>
          <ul>
            {module.subArticles.map((sa) => (
              <li key={sa.slug} className="mb-2">
                <Link
                  as={NextLink}
                  href={`/articles/${moduleSlug}/${sa.slug}`}
                  className={clsx(
                    'block px-3 py-1 rounded hover:bg-default-100',
                    {
                      'bg-primary text-primary-foreground font-medium': sa.slug === subArticleSlug,
                      'text-default-700': sa.slug !== subArticleSlug
                    }
                  )}
                >
                  {sa.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal do Artigo */}
      <article className="w-full md:w-3/4 lg:w-4/5">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{subArticle.title}</h1>
        {/* TODO: Adicionar metadados como autor, data, tags aqui */}
        
        {/* Usar TailwindCSS Typography para estilizar o Markdown renderizado */}
        <div className="prose dark:prose-invert max-w-none">
          {/* Renderizar conteúdo com ReactMarkdown e GFM */}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {subArticle.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

// Opcional: Gerar rotas estáticas para os artigos no build time
// export async function generateStaticParams() {
//   const paths: { slug: string[] }[] = [];
//   mockArticleModules.forEach(module => {
//     module.subArticles.forEach(subArticle => {
//       paths.push({ slug: [module.slug, subArticle.slug] });
//     });
//   });
//   return paths;
// } 