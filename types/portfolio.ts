/* eslint-disable prettier/prettier */
import { Tag } from './tag'; // Reutilizar o tipo Tag dos artigos

export interface PortfolioProject {
  id: string; // Adicionado, conforme schema do backend
  member_id: string; // Adicionado, conforme schema do backend
  created_at: string; // Adicionado, conforme schema do backend
  updated_at: string; // Adicionado, conforme schema do backend
  slug: string; // Identificador único (pode ser derivado do nome do repo)
  title: string; // Nome do projeto/repositório
  description: string; // Descrição curta
  repo_url: string; // Alterado de repoUrl para repo_url
  tags?: Tag[]; // Alterado de string[] para Tag[], e opcional
  // Campos opcionais para preview (podem ser buscados dinamicamente depois)
  // ownerAvatarUrl?: string;
  // stars?: number;
  // language?: string;
} 