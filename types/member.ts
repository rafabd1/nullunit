export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'personal' | string; // Adicione outras plataformas se necessário
  url: string;
}

export interface Member {
  username: string; // Identificador único, usado na URL (ex: 'rafael-sousa')
  name: string; // Nome completo para exibição
  role: string; // Cargo ou função (ex: 'Security Researcher', 'Frontend Developer')
  avatarUrl?: string; // URL para a foto de perfil (opcional)
  bio: string; // Pequena descrição/biografia
  socialLinks?: SocialLink[]; // Links para redes sociais (opcional)
} 