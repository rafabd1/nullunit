/* eslint-disable prettier/prettier */
import { notFound } from "next/navigation";

// Importar o novo tipo Article
import { Article } from "@/types/article"; 
// Remover import dinâmico desnecessário aqui, já que DynamicArticleLoader é importado estaticamente
// import dynamic from 'next/dynamic'; 

// Importar o NOVO loader estaticamente
import { DynamicArticleLoader } from '@/components/dynamic-article-loader';

// Remover mockArticleModules e tipos antigos
// import { mockArticleModules } from "@/lib/mock-articles";
// import { ArticleModule, SubArticle } from "@/types/article";

// Função para buscar os dados do artigo via API
async function getArticleData(params: { slug: string }): Promise<Article | undefined> {
  try {
    // O slug do artigo é diretamente params.slug
    const articleSlug = params.slug;
    
    const apiUrlBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrlBase}/api/articles/${articleSlug}`);

    if (!res.ok) {
      // Se a resposta não for OK (ex: 404, 500), logar e retornar undefined
      // Isso fará com que a página retorne notFound()
      console.error(`Error fetching article ${articleSlug}: ${res.status} ${res.statusText}`);
      return undefined;
    }

    const article: Article = await res.json();
    return article;
  } catch (error) {
    console.error(`Failed to fetch article data for slug ${params.slug}:`, error);
    return undefined;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }; // Alterado de string[] para string
}) {
  // Passar params diretamente ou apenas o slug, dependendo de como getArticleData espera
  const article = await getArticleData(params);

  // Se o artigo não for encontrado (ou erro na busca), mostrar página 404
  if (!article) {
    notFound();
  }

  // Renderizar o LOADER (que por sua vez carrega dinamicamente o conteúdo)
  // DynamicArticleLoader precisará ser adaptado para receber 'article'
  return (
    <DynamicArticleLoader 
      article={article} // Passando o objeto article completo
      // Props antigas removidas:
      // module={articleModule}
      // subArticle={subArticle}
      // moduleSlug={moduleSlug}
      // subArticleSlug={subArticleSlug}
    />
  );
}

// Opcional: Gerar rotas estáticas para os artigos no build time
// Se for usar, precisará ser adaptado para buscar slugs da API
// export async function generateStaticParams() {
//   // Exemplo de como buscaria da API:
//   // const res = await fetch('/api/articles'); // Supondo um endpoint que lista todos os artigos (ou slugs)
//   // const articles: Article[] = await res.json();
//   // return articles.filter(article => article.published).map(article => ({
//   //   slug: article.slug,
//   // }));
//   return []; // Placeholder
// }
