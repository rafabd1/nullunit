/* eslint-disable prettier/prettier */
import { Tag } from './tag'; // Importar Tag do novo arquivo

// Representa um artigo simplificado, alinhado com o backend
export interface Article {
  id: string; // UUID
  created_at: string;
  updated_at: string;
  slug: string; // Slug único para URL
  title: string; // Título do artigo
  description?: string | null; // Sumário opcional do artigo
  content: string; // Conteúdo completo do artigo (Markdown/MDX)
  member_id: string; // UUID do autor (Member)
  published: boolean; // Se o artigo está publicado
  verified?: boolean; // Se o artigo foi verificado (opcional no frontend por enquanto)
  tags?: Tag[]; // Lista de tags associadas
  // Adicionar outros campos conforme necessário, ex:
  // author_username?: string; // Se quisermos mostrar o nome do autor diretamente
  // views?: number;
}
