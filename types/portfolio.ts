/* eslint-disable prettier/prettier */
export interface PortfolioProject {
  slug: string; // Identificador único (pode ser derivado do nome do repo)
  title: string; // Nome do projeto/repositório
  description: string; // Descrição curta
  repoUrl: string; // URL para o repositório GitHub
  tags?: string[]; // Tags para categorização e busca
  // Campos opcionais para preview (podem ser buscados dinamicamente depois)
  // ownerAvatarUrl?: string;
  // stars?: number;
  // language?: string;
} 