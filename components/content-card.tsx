import React from 'react';
import NextLink from 'next/link';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { GithubIcon } from "@/components/icons"; // Icone para projetos
import { Tag } from '@/types/article'; // Importar o tipo Tag

interface ContentCardProps {
  type: 'article' | 'project';
  slug: string; // Slug do conteúdo principal (artigo ou projeto)
  title: string;
  description?: string;
  tags?: Tag[]; // Alterado de string[] para Tag[]
  href: string; // URL de destino (interna ou externa)
  linkText: string; // Texto do link (ex: "Read Article", "View on GitHub")
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
  type, 
  slug, 
  title, 
  description, 
  tags, 
  href, 
  linkText 
}) => {
  const isExternalLink = type === 'project';
  const chipColor = type === 'article' ? 'primary' : 'secondary';

  return (
    <Card key={slug} shadow="sm" className="bg-content1 dark:bg-content1-dark h-full flex flex-col">
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <h4 className="font-bold text-large mb-1 line-clamp-2">{title}</h4>
        {description && (
          <p className="text-sm text-default-600 dark:text-default-400 mb-2 line-clamp-3 flex-grow">
            {description}
          </p>
        )}
      </CardHeader>
      <CardBody className="pt-2 pb-2 px-4 flex-grow">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <Chip
                key={tag.id} // Revertido para tag.id, pois slug pode não estar presente
                color={chipColor}
                size="sm"
                variant="flat"
                className="cursor-default"
              >
                {tag.name}
              </Chip>
            ))}
          </div>
        )}
      </CardBody>
      <CardFooter className="justify-start px-4 pb-4 pt-0 mt-auto">
        <Link
          as={!isExternalLink ? NextLink : undefined}
          isExternal={isExternalLink}
          showAnchorIcon={isExternalLink}
          href={href}
          size="sm"
          color={isExternalLink ? "foreground" : "primary"}
          className={isExternalLink ? "text-default-600 hover:text-primary dark:text-default-400 dark:hover:text-primary-dark font-medium" : "font-medium"}
        >
          {linkText}
        </Link>
      </CardFooter>
    </Card>
  );
}; 