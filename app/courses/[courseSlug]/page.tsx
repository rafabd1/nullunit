// Página de detalhes de um curso
import React from 'react';
import { notFound } from 'next/navigation';

import { Course } from '@/types/course';
import { CourseOverview } from '@/components/CourseOverview';

interface CourseDetailPageProps {
  params: {
    courseSlug: string;
  };
}

// Função para buscar os dados completos do curso
async function getCourseDetails(slug: string): Promise<Course | null> {
  try {
    // Construir a URL da API.
    // Considere o uso de variáveis de ambiente para a URL base da API em um projeto real.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/courses/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Curso não encontrado
      }
      throw new Error(`Failed to fetch course details: ${response.status} ${response.statusText}`);
    }
    const courseData: Course = await response.json();
    return courseData;
  } catch (error) {
    console.error(`Error fetching course ${slug}:`, error);
    // Em caso de outros erros (rede, parse JSON), poderia lançar o erro para uma ErrorBoundary
    // ou retornar null para acionar notFound() também.
    // Para consistência, vamos retornar null para que notFound() seja chamado.
    return null; 
  }
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const course = await getCourseDetails(params.courseSlug);

  if (!course) {
    notFound(); // Exibe a página 404 se o curso não for encontrado ou houver erro
  }

  return (
    <CourseOverview course={course} />
  );
}

// Opcional: Gerar rotas estáticas para cursos no build time
// export async function generateStaticParams() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/courses`);
//     if (!response.ok) return [];
//     const courses: Course[] = await response.json();
//     return courses.filter(c => c.published).map((course) => ({
//       courseSlug: course.slug,
//     }));
//   } catch (error) {
//     console.error("Failed to generate static params for courses:", error);
//     return [];
//   }
// } 