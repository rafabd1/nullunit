// Placeholder para a página de visualização de uma lição
import React from 'react';

interface LessonViewPageProps {
  params: {
    courseSlug: string;
    moduleSlug: string;
    lessonId: string; // Ou lessonSlug, dependendo da definição final da rota
  };
}

export default function LessonViewPage({ params }: LessonViewPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Lesson Viewer</h1>
      <p>Course: {params.courseSlug}</p>
      <p>Module: {params.moduleSlug}</p>
      <p>Lesson ID: {params.lessonId}</p>
      <div className="mt-4 p-4 border rounded">
        <p>Lesson content will be displayed here.</p>
        {/* 
          Futuramente:
          - Fetch dados da lição específica da API usando os slugs/IDs.
          - Usar LessonContentView component.
          - Considerar navegação entre lições (próxima/anterior).
        */}
      </div>
    </div>
  );
} 