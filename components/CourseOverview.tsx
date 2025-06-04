/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import { Chip } from '@heroui/chip';
import { LockIcon, UnlockIcon, InfoIcon, BookOpenTextIcon, SparklesIcon } from 'lucide-react'; // Ícones
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Course, CourseModule as CourseModuleType, Lesson as LessonType } from '@/types/course'; // Tipos de Curso
// import { UserProfile } from '@/types/member'; // Se for exibir dados do instrutor

// Importar o componente ModuleList real
import { ModuleList } from '@/components/ModuleList';

// Remover ModuleListPlaceholder
// const ModuleListPlaceholder: React.FC<{ modules?: CourseModuleType[] }> = ({ modules }) => (
//   <div className="mt-6 p-4 border border-dashed border-default-300 rounded-lg">
//     <h3 className="text-xl font-semibold mb-3 text-default-600">Course Modules</h3>
//     {modules && modules.length > 0 ? (
//       <p className="text-default-500">ModuleList component will render {modules.length} module(s) here.</p>
//     ) : (
//       <p className="text-default-500">No modules available for this course yet.</p>
//     )}
//   </div>
// );

interface CourseOverviewProps {
  course: Course;
  // instructor?: UserProfile; // Opcional, se for buscar dados do instrutor
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({ course }) => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      {/* Cabeçalho do Curso */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground">
            {course.title}
          </h1>
          {course.is_paid ? (
            <Chip 
              size="lg" 
              variant="flat" 
              color="warning" 
              className="flex-shrink-0"
              startContent={<LockIcon size={18} />}
            >
              Paid Course
            </Chip>
          ) : (
            <Chip 
              size="lg" 
              variant="flat" 
              color="success" 
              className="flex-shrink-0"
              startContent={<UnlockIcon size={18} />}
            >
              Free Course
            </Chip>
          )}
        </div>

        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {course.tags.map((tag) => (
              <Chip key={tag.id} size="sm" variant="bordered" color="default">
                {tag.name}
              </Chip>
            ))}
          </div>
        )}
      </header>

      {/* Conteúdo do Curso: Descrição e Módulos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal: Descrição */}
        <main className="lg:col-span-2">
          {course.description && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <InfoIcon size={22} className="mr-2 text-primary" /> About This Course
              </h2>
              <article className="prose dark:prose-invert max-w-none text-default-700 dark:text-default-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {course.description}
                </ReactMarkdown>
              </article>
            </section>
          )}
          
          {/* Aviso de conteúdo para assinantes */}
          {course.is_paid && (
            <section className="my-8 p-4 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg text-primary-700 dark:text-primary-300">
              <div className="flex items-center mb-2">
                <SparklesIcon size={20} className="mr-2 text-primary dark:text-primary-400" />
                <h4 className="font-semibold text-lg">Exclusive Subscriber Content</h4>
              </div>
              <p className="text-sm">
                Unlock practical exercises, downloadable resources, and more by becoming a NullUnit Pro subscriber. 
                Future updates may include direct Q&A with instructors and access to special tools.
              </p>
              {/* Poderia adicionar um botão/link para a página de assinatura no futuro */}
              {/* <Button size="sm" color="primary" className="mt-3">Learn More</Button> */}
            </section>
          )}
          
          {/* Seção de Módulos - Usando ModuleList real */}
          <section>
             <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <BookOpenTextIcon size={22} className="mr-2 text-primary" /> Course Content
              </h2>
            <ModuleList modules={course.modules} courseSlug={course.slug} />
          </section>
        </main>

        {/* Sidebar (pode ser usada para info adicional, progresso, etc. no futuro) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 p-6 bg-content2 dark:bg-content2-dark rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Instructor</h3>
            <p className="text-sm text-default-600 dark:text-default-400">
              Details about the instructor (ID: {course.member_id}) will be displayed here soon.
            </p>
            {/* TODO: Adicionar mais informações como: Nível, Duração total, Nº de alunos, etc. */}
            <div className="mt-4 pt-4 border-t border-default-200 dark:border-default-700">
                <p className="text-xs text-default-500 dark:text-default-500">Last updated: {new Date(course.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}; 