/* eslint-disable prettier/prettier */
import { Tag } from './article'; // Importando o tipo Tag existente

// Representa uma lição dentro de um módulo de curso
export interface Lesson {
  id: string; // UUID
  course_module_id: string; // UUID do módulo pai
  created_at: string;
  updated_at: string;
  title: string;
  content: string; // Conteúdo da lição (Markdown, vídeo embed, etc.)
  order: number; // Ordem da lição dentro do módulo
  // Campos adicionais, se necessário:
  // video_url?: string;
  // duration_minutes?: number;
}

// Representa um módulo dentro de um curso
export interface CourseModule {
  id: string; // UUID
  course_id: string; // UUID do curso pai
  created_at: string;
  updated_at: string;
  slug: string; // Slug único do módulo dentro do curso
  title: string;
  description?: string | null;
  order: number; // Ordem do módulo dentro do curso
  lessons?: Lesson[]; // Lista de lições (pode ser populado conforme necessário)
}

// Representa um curso
export interface Course {
  id: string; // UUID
  created_at: string;
  updated_at: string;
  slug: string; // Slug único para URL
  title: string;
  description?: string | null;
  member_id: string; // UUID do instrutor (Member)
  is_paid: boolean; // Se o curso requer pagamento/assinatura para acesso completo
  published: boolean; // Se o curso está publicado
  verified?: boolean; // Se o curso foi verificado
  tags?: Tag[]; // Lista de tags associadas
  modules?: CourseModule[]; // Lista de módulos (pode ser populado conforme necessário)
  // Campos adicionais, se necessário:
  // instructor_name?: string;
  // cover_image_url?: string;
  // student_count?: number;
  // rating?: number;
}

// Para previews de curso, podemos ter um tipo mais leve, se necessário
export interface CoursePreview extends Omit<Course, 'modules' | 'content'> {
  // Poderia ter um resumo do número de módulos/lições
  module_count?: number;
  lesson_count?: number;
} 