import { PortfolioProject } from '@/types/portfolio';

export const mockPortfolioProjects: PortfolioProject[] = [
  {
    slug: 'nullunit-website',
    title: 'NullUnit Website',
    description: 'The official website for the NullUnit team, built with Next.js and HeroUI.',
    repoUrl: 'https://github.com/nullunit-org/nullunit-website', // Exemplo
    tags: ['Next.js', 'React', 'TypeScript', 'HeroUI', 'Website'],
  },
  {
    slug: 'ctf-toolkit',
    title: 'CTF Toolkit',
    description: 'A collection of useful scripts and tools for Capture The Flag competitions.',
    repoUrl: 'https://github.com/nullunit-org/ctf-toolkit', // Exemplo
    tags: ['CTF', 'Python', 'Security Tools', 'Automation'],
  },
  {
    slug: 'vuln-scanner',
    title: 'Simple Vulnerability Scanner',
    description: 'A basic proof-of-concept vulnerability scanner for web applications.',
    repoUrl: 'https://github.com/nullunit-org/vuln-scanner', // Exemplo
    tags: ['Security', 'Scanner', 'Python', 'Web Application'],
  },
  // Adicione mais projetos aqui
]; 