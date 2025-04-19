import { notFound } from 'next/navigation';
import { mockMembers } from "@/lib/mock-members";
import { Member } from "@/types/member";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import { GithubIcon, TwitterIcon /*, LinkedinIcon, LinkIcon */ } from "@/components/icons"; // Importe os ícones necessários
import React from "react";

// Componente auxiliar para ícones sociais (pode ser movido para um arquivo compartilhado)
const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case 'github':
      return <GithubIcon className="text-default-500" />;
    case 'twitter':
      return <TwitterIcon className="text-default-500" />;
    // case 'linkedin':
    //   return <LinkedinIcon className="text-default-500" />;
    // case 'personal':
    //   return <LinkIcon className="text-default-500" />;
    default:
      return null;
  }
};

// Função para buscar dados do membro
async function getMemberData(username: string): Promise<Member | undefined> {
  // Em uma aplicação real, buscaria da API/banco de dados
  return mockMembers.find((m) => m.username === username);
}

export default async function MemberProfilePage({ params }: { params: { username: string } }) {
  const member = await getMemberData(params.username);

  if (!member) {
    notFound(); // Retorna 404 se o membro não for encontrado
  }

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <Avatar 
        src={member.avatarUrl} 
        // name={member.name.charAt(0)} 
        className="w-32 h-32 text-large mt-4"
        isBordered
        color="secondary"
      />
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">{member.name}</h1>
        <p className="text-xl text-default-500">{member.role}</p>
      </div>

      <p className="max-w-xl text-lg text-default-700">{member.bio}</p>

      {member.socialLinks && member.socialLinks.length > 0 && (
        <div className="flex gap-4 mt-2">
          {member.socialLinks.map((link) => (
            <Link 
              key={link.platform} 
              isExternal 
              href={link.url} 
              aria-label={`${member.name} on ${link.platform}`}
              className="text-default-600 hover:text-primary"
            >
              <SocialIcon platform={link.platform} />
              {/* Opcional: Mostrar nome da plataforma 
              <span className="ml-1">{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</span> 
              */}
            </Link>
          ))}
        </div>
      )}

      {/* TODO: Adicionar mais seções se necessário (ex: artigos escritos pelo membro, projetos) */}
    </div>
  );
}

// Opcional: Gerar rotas estáticas para os membros
// export async function generateStaticParams() {
//   return mockMembers.map((member) => ({
//     username: member.username,
//   }));
// } 