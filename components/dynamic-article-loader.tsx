'use client'; // Este loader precisa ser cliente para usar dynamic com ssr: false

import dynamic from 'next/dynamic';
// Importar o novo tipo Article e remover os antigos
import { Article } from '@/types/article';

// Importar dinamicamente o componente de conteúdo real
const ArticleClientContent = dynamic(
  () => import('@/components/article-client-content').then(mod => mod.ArticleClientContent),
  {
    ssr: false,
    // Opcional: adicionar um componente de loading
    // loading: () => <p>Loading article content...</p>, 
  }
);

// Props que o loader recebe da página do servidor atualizadas
interface DynamicArticleLoaderProps {
  article: Article; // Agora recebe o objeto Article completo
  // Props antigas removidas:
  // module: ArticleModule;
  // subArticle: SubArticle;
  // moduleSlug: string;
  // subArticleSlug: string;
}

// Componente que apenas carrega dinamicamente e passa as props atualizadas
export const DynamicArticleLoader = (props: DynamicArticleLoaderProps) => {
  // Passar o objeto article para ArticleClientContent
  return <ArticleClientContent article={props.article} />;
}; 