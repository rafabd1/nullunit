/* eslint-disable prettier/prettier */
export interface SubArticle {
  slug: string; // Identificador único para URL (ex: 'introducao-sql-injection')
  title: string; // Título do sub-artigo
  // O conteúdo pode ser string (Markdown/MDX) ou outro formato
  content: string;
  // Metadados adicionados
  author?: string; // Nome do autor ou username
  publishedDate?: string; // Data no formato YYYY-MM-DD ou outro
  tags?: string[]; // Lista de tags
  description?: string; // Adicionado para resumos opcionais
  // Campos opcionais (podemos adicionar depois)
  // author?: string;
  // publishedDate?: string;
  // tags?: string[];
}

export interface ArticleModule {
  slug: string; // Identificador único para URL do módulo (ex: 'sql-injection')
  title: string; // Título do módulo (ex: 'SQL Injection Completo')
  description?: string; // Descrição curta do módulo (opcional)
  tags?: string[]; // Adicionar tags ao módulo
  subArticles: SubArticle[]; // Lista de sub-artigos dentro do módulo
  // Campos opcionais
  // category?: string;
  // level?: 'beginner' | 'intermediate' | 'advanced';
}
