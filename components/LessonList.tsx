/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import NextLink from 'next/link';
import { Link } from '@heroui/link';
import { PlayCircleIcon, FileTextIcon } from 'lucide-react'; // Ícones para tipos de lição

import { Lesson } from '@/types/course';

interface LessonListProps {
  lessons?: Lesson[];
  courseSlug: string;
  moduleSlug: string;
}

export const LessonList: React.FC<LessonListProps> = ({ lessons, courseSlug, moduleSlug }) => {
  if (!lessons || lessons.length === 0) {
    return <p className="text-sm text-default-500 px-4 py-2">No lessons in this module yet.</p>;
  }

  // Determina o ícone baseado no título ou tipo futuro da lição
  const getLessonIcon = (lessonTitle: string) => {
    if (lessonTitle.toLowerCase().includes('video')) {
      return <PlayCircleIcon size={16} className="mr-2 text-primary flex-shrink-0" />;
    }
    return <FileTextIcon size={16} className="mr-2 text-default-500 flex-shrink-0" />;
  };

  return (
    <ul className="list-none p-0 m-0 divide-y divide-default-200 dark:divide-default-700">
      {lessons.map((lesson, index) => (
        <li key={lesson.id}>
          <Link 
            as={NextLink}
            href={`/courses/${courseSlug}/module/${moduleSlug}/lesson/${lesson.id}`} 
            className="flex items-center px-4 py-3 hover:bg-default-100 dark:hover:bg-default-50 focus:bg-default-100 dark:focus:bg-default-50 transition-colors w-full text-left"
            color="foreground"
          >
            {getLessonIcon(lesson.title)}
            <span className="text-sm font-medium flex-grow">
              {index + 1}. {lesson.title}
            </span>
            {/* Poderia adicionar duração da lição aqui se disponível */}
            {/* <span className="text-xs text-default-500">5 min</span> */}
          </Link>
        </li>
      ))}
    </ul>
  );
}; 