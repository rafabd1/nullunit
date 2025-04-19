/* eslint-disable prettier/prettier */
import { Member } from '@/types/member';

// Ícones podem ser importados de @/components/icons se necessário
// import { GithubIcon, TwitterIcon, LinkedinIcon } from "@/components/icons";

export const mockMembers: Member[] = [
  {
    username: 'alice-wonder',
    name: 'Alice Wonder',
    role: 'Lead Security Researcher',
    avatarUrl: 'https://i.pravatar.cc/150?u=alice', // Placeholder avatar
    bio: 'Passionate about finding vulnerabilities and breaking systems. Specializes in web application security.',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/alice' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/alice' },
      { platform: 'twitter', url: 'https://twitter.com/alicew' },
    ],
  },
  {
    username: 'bob-builder',
    name: 'Bob Builder',
    role: 'CTF Player & Exploit Developer',
    avatarUrl: 'https://i.pravatar.cc/150?u=bob', // Placeholder avatar
    bio: 'Loves Capture The Flag competitions and crafting elegant exploits. Focuses on binary exploitation and reverse engineering.',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/bob' },
      { platform: 'personal', url: 'https://bob.dev' },
    ],
  },
  {
    username: 'charlie-chaplin',
    name: 'Charlie Chaplin',
    role: 'Infrastructure Security',
    // Sem avatarUrl neste exemplo
    bio: 'Ensures our digital fortress is secure. Expert in cloud security, network hardening, and incident response.',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/charlie' },
    ],
  },
  // Adicione mais membros aqui
]; 