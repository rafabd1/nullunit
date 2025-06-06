import React from 'react';
import NextLink from 'next/link';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { GithubIcon } from "@/components/icons"; // Icone para projetos
import { Tag } from "@/components/ui/tag";

interface ContentCardProps {
  type: 'article' | 'project';
  slug: string; // Slug do conteúdo principal (artigo ou projeto)
  title: string;
  description?: string;
  tags?: { id: string; name: string; slug: string }[];
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
    <Card
      key={slug}
      className="group h-full transform-gpu transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg"
    >
      <CardBody className="flex h-full flex-col justify-between p-6">
        <div>
          <NextLink href={href}>
            <h4 className="mb-2 text-xl font-bold text-foreground transition-colors line-clamp-2 group-hover:text-primary">
              {title}
            </h4>
          </NextLink>

          {description && (
            <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {tags.map((tag) => (
              <Tag key={tag.id} name={tag.name} slug={tag.slug} />
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