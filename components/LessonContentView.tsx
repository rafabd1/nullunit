/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Lesson } from '@/types/course'; // Tipo da Lição
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Link as HeroLink } from '@heroui/link';
import NextLink from 'next/link'; // Para navegação interna com HeroLink
import { ChevronLeftIcon, BookOpenTextIcon, ChevronsRightIcon } from 'lucide-react';

interface LessonContentViewProps {
  lesson: Lesson;
  courseSlug: string;
  moduleSlug: string;
  moduleTitle: string; // Para o breadcrumb
  courseTitle: string; // Para o breadcrumb
}

export const LessonContentView: React.FC<LessonContentViewProps> = ({ 
    lesson, 
    courseSlug, 
    moduleSlug, 
    moduleTitle,
    courseTitle 
}) => {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumbs Manuais */}
      <div className="mb-6 flex items-center space-x-1 text-sm text-default-600 dark:text-default-400">
        <HeroLink as={NextLink} href="/courses" color="foreground" className="hover:text-primary dark:hover:text-primary-dark">
          Courses
        </HeroLink>
        <ChevronsRightIcon size={14} className="text-default-400 dark:text-default-500" />
        <HeroLink as={NextLink} href={`/courses/${courseSlug}`} color="foreground" className="hover:text-primary dark:hover:text-primary-dark">
          {courseTitle}
        </HeroLink>
        <ChevronsRightIcon size={14} className="text-default-400 dark:text-default-500" />
        {/* Módulo não é clicável, pois não tem página própria */}
        <span className="text-default-500 dark:text-default-300">{moduleTitle}</span>
        <ChevronsRightIcon size={14} className="text-default-400 dark:text-default-500" />
        <span className="font-semibold text-primary dark:text-primary-dark">{lesson.title}</span>
      </div>

      <Card shadow="sm" className="bg-content1 dark:bg-content1-dark">
        <CardHeader className="border-b border-default-200 dark:border-default-700 pb-4">
          <div className="flex flex-col w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {lesson.title}
            </h1>
            {/* Poderia adicionar informações da lição aqui, como data, tipo, etc. */}
          </div>
        </CardHeader>
        <CardBody className="py-6">
          {lesson.content ? (
            <article className="prose dark:prose-invert max-w-none text-default-700 dark:text-default-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {lesson.content}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-center py-10 text-default-500 dark:text-default-400">
              <BookOpenTextIcon size={48} className="mx-auto mb-4 text-default-400 dark:text-default-500" />
              <p className="text-lg font-semibold">Content for this lesson is not available yet.</p>
              <p>Please check back later or contact the instructor.</p>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="mt-8">
        <HeroLink 
            as={NextLink}
            href={`/courses/${courseSlug}#module-${moduleSlug}`} // Ajustar se o ID do card do módulo for diferente
            color="primary"
            className="inline-flex items-center text-sm"
        >
          <ChevronLeftIcon size={16} className="mr-1" />
          Back to {moduleTitle} overview
        </HeroLink>
      </div>
    </div>
  );
}; 