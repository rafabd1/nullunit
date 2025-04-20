/* eslint-disable prettier/prettier */
import { notFound } from "next/navigation";

import { mockArticleModules } from "@/lib/mock-articles";
import { ArticleModule, SubArticle } from "@/types/article";
// Remover import dinâmico daqui
// import dynamic from 'next/dynamic'; 

// Importar o NOVO loader estaticamente
import { DynamicArticleLoader } from '@/components/dynamic-article-loader';

// // Remover a constante do componente importado dinamicamente
// const ArticleClientContent = dynamic(
//   () => import('@/components/article-client-content').then(mod => mod.ArticleClientContent),
//   { ssr: false }
// );

// Função para buscar os dados (simulando busca)
async function getArticleData(params: { slug: string[] }): Promise<{
  articleModule: ArticleModule | undefined;
  subArticle: SubArticle | undefined;
  moduleSlug: string;
  subArticleSlug: string;
}> {
  const [moduleSlug, subArticleSlug] = params.slug || [];
  const articleModule = mockArticleModules.find((m) => m.slug === moduleSlug);
  const subArticle = articleModule?.subArticles.find(
    (sa) => sa.slug === subArticleSlug,
  );

  return { articleModule, subArticle, moduleSlug, subArticleSlug };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { articleModule, subArticle, moduleSlug, subArticleSlug } =
    await getArticleData(params);

  // Se módulo ou sub-artigo não for encontrado, mostrar página 404
  if (!articleModule || !subArticle) {
    notFound();
  }

  // Renderizar o LOADER (que por sua vez carrega dinamicamente o conteúdo)
  return (
    <DynamicArticleLoader 
      module={articleModule}
      subArticle={subArticle}
      moduleSlug={moduleSlug}
      subArticleSlug={subArticleSlug}
    />
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
