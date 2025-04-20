import React from 'react';
import NextLink from 'next/link';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { GithubIcon } from "@/components/icons"; // Icone para projetos

interface ContentCardProps {
  type: 'article' | 'project';
  slug: string;
  title: string;
  description?: string;
  tags?: string[];
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
    <Card key={slug} shadow="sm">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large mb-1">{title}</h4>
        {description && (
          <p className="text-sm text-default-600 mb-2">
            {description}
          </p>
        )}
      </CardHeader>
      <CardBody className="pt-0">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <Chip
                key={tag}
                color={chipColor}
                size="sm"
                variant="flat"
              >
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </CardBody>
      <CardFooter className="justify-start">
        <Link
          as={!isExternalLink ? NextLink : undefined}
          isExternal={isExternalLink}
          className={isExternalLink ? "text-default-600 hover:text-primary" : undefined}
          color={isExternalLink ? "foreground" : "primary"}
          href={href}
          size="sm"
        >
          {isExternalLink && <GithubIcon className="mr-1" size={16} />}
          {linkText}
        </Link>
      </CardFooter>
    </Card>
  );
}; 