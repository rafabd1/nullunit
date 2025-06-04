/* eslint-disable prettier/prettier */
import { notFound } from 'next/navigation';
import { LessonContentView } from '@/components/LessonContentView';
import { Lesson, Course, CourseModule } from '@/types/course';

// Tipo para os dados combinados que a página precisa
interface LessonPageData {
  lesson: Lesson;
  courseTitle: string;
  moduleTitle: string;
}

async function getLessonData(params: { 
  courseSlug: string; 
  moduleSlug: string; 
  lessonSlug: string; 
}): Promise<LessonPageData | undefined> {
  try {
    const apiUrlBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    // Buscar o curso completo
    const courseRes = await fetch(`${apiUrlBase}/api/courses/${params.courseSlug}`);
    if (!courseRes.ok) {
      console.error(`Error fetching course ${params.courseSlug}: ${courseRes.status} ${courseRes.statusText}`);
      return undefined;
    }
    const course: Course = await courseRes.json();

    // Encontrar o módulo atual
    const currentModule = course.modules?.find(m => m.slug === params.moduleSlug);
    if (!currentModule) {
      console.error(`Module ${params.moduleSlug} not found in course ${params.courseSlug}`);
      return undefined;
    }

    // Encontrar a lição atual
    const currentLesson = currentModule.lessons?.find(l => l.slug === params.lessonSlug);
    if (!currentLesson) {
      console.error(`Lesson ${params.lessonSlug} not found in module ${params.moduleSlug} (Course: ${params.courseSlug})`);
      return undefined;
    }

    return {
      lesson: currentLesson,
      courseTitle: course.title,
      moduleTitle: currentModule.title,
    };

  } catch (error) {
    console.error(`Failed to fetch lesson data for ${params.courseSlug}/${params.moduleSlug}/${params.lessonSlug}:`, error);
    return undefined;
  }
}

export default async function LessonPage({params,}: {
  params: { courseSlug: string; moduleSlug: string; lessonSlug: string };
}) {
  const data = await getLessonData(params);

  if (!data) {
    notFound();
  }

  return (
    <LessonContentView 
      lesson={data.lesson}
      courseSlug={params.courseSlug}
      moduleSlug={params.moduleSlug}
      courseTitle={data.courseTitle}
      moduleTitle={data.moduleTitle}
    />
  );
}

// Opcional: Gerar rotas estáticas para as lições no build time
// Isso garante que as páginas das lições sejam pré-renderizadas no build
export async function generateStaticParams() {
  try {
    const apiUrlBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrlBase}/api/courses`);
    if (!res.ok) {
        console.error("Failed to fetch courses for static params generation:", res.status, res.statusText);
        return [];
    }
    const courses: Course[] = await res.json();
    const paramsList: { courseSlug: string; moduleSlug: string; lessonSlug: string }[] = [];

    for (const course of courses) {
      if (course.slug && course.modules) {
        for (const module of course.modules) {
          if (module.slug && module.lessons) {
            for (const lesson of module.lessons) {
              if (lesson.slug) {
                paramsList.push({
                  courseSlug: course.slug,
                  moduleSlug: module.slug,
                  lessonSlug: lesson.slug,
                });
              }
            }
          }
        }
      }
    }
    return paramsList;
  } catch (error) {
    console.error("Error in generateStaticParams for lessons:", error);
    return [];
  }
} 