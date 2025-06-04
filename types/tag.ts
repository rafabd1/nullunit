/* eslint-disable prettier/prettier */

// Representa uma tag individual, usada em Artigos, Cursos, Projetos de Portfólio, etc.
export interface Tag {
  id: string; // UUID da tag
  name: string; // Nome da tag (ex: 'Cibersegurança')
} 