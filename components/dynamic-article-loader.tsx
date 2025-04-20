'use client'; // Este loader precisa ser cliente para usar dynamic com ssr: false

import dynamic from 'next/dynamic';
import { ArticleModule, SubArticle } from '@/types/article'; // Importar tipos

// Importar dinamicamente o componente de conteúdo real
const ArticleClientContent = dynamic(
  () => import('@/components/article-client-content').then(mod => mod.ArticleClientContent),
  {
    ssr: false,
    // Opcional: adicionar um componente de loading
    // loading: () => <p>Loading article content...</p>, 
  }
);

// Props que o loader recebe da página do servidor
interface DynamicArticleLoaderProps {
  module: ArticleModule;
  subArticle: SubArticle;
  moduleSlug: string;
  subArticleSlug: string;
}

// Componente que apenas carrega dinamicamente e passa as props
export const DynamicArticleLoader = (props: DynamicArticleLoaderProps) => {
  return <ArticleClientContent {...props} />;
}; 