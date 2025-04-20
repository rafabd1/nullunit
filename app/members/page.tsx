import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import NextLink from "next/link";

// Importar dados mock e tipos
import { mockMembers } from "@/lib/mock-members";
import { Member } from "@/types/member";

// Ícones para links sociais (exemplo)
import { GithubIcon, TwitterIcon /*, LinkedinIcon, LinkIcon */ } from "@/components/icons"; // Adicione outros ícones conforme necessário
import React from "react";

// Componente auxiliar para renderizar ícone social
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
      return null; // Ou um ícone genérico
  }
};

export default function MembersPage() {
  const members: Member[] = mockMembers;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Team</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((member) => (
          <Card key={member.username} shadow="sm" className="text-center">
            <CardHeader className="justify-center">
              <Avatar 
                src={member.avatarUrl} 
                // name={member.name.charAt(0)} // Fallback se não houver avatarUrl
                className="w-24 h-24 text-large" 
                isBordered 
                color="primary"
              />
            </CardHeader>
            <CardBody className="pt-0 px-4 text-center">
              <h4 className="font-bold text-large mb-1">{member.name}</h4>
              <p className="text-default-500 text-sm mb-2">{member.role}</p>
              <p className="text-sm text-default-600">{member.bio}</p>
            </CardBody>
            <CardFooter className="flex-col items-center pb-4">
              {/* Container para ícones sociais */}
              <div className="flex justify-center gap-2 mb-3">
                {member.socialLinks?.map((link) => (
                  <Link 
                    key={link.platform} 
                    isExternal 
                    href={link.url} 
                    aria-label={`${member.name} on ${link.platform}`}
                  >
                    <SocialIcon platform={link.platform} />
                  </Link>
                ))}
              </div>
              {/* Link para o perfil completo */}
              <Link as={NextLink} href={`/members/${member.username}`} color="primary" size="sm">
                View Profile
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 