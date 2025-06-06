// Página de listagem de Cursos
"use client";

import React, { useState, useEffect, useMemo } from 'react';

import { Course } from '@/types/course'; // Tipos de Curso
import { Tag } from '@/types/article'; // Importar Tag de article.ts
import { CourseCard } from '@/components/CourseCard'; // Componente CourseCard
import { FilterBar } from '@/components/filter-bar'; // Descomentado
import { apiFetch } from '@/lib/api'; // Importa a nova função

// Função de filtro para Cursos
const filterCourses = (course: Course, searchTerm: string, selectedTags: Set<string>): boolean => {
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  const titleMatch = course.title.toLowerCase().includes(lowerSearchTerm);
  const descriptionMatch = Boolean(course.description && course.description.toLowerCase().includes(lowerSearchTerm));
  
  const courseTagNames = course.tags?.map(t => t.name.toLowerCase()) || [];
  const tagContentMatch = courseTagNames.some(tagName => tagName.includes(lowerSearchTerm));
  
  const matchesSearch = searchTerm === '' || titleMatch || descriptionMatch || tagContentMatch;

  let matchesSelectedTags = true; 
  if (selectedTags.size > 0) {
    if (!course.tags || course.tags.length === 0) {
      matchesSelectedTags = false;
    } else {
      matchesSelectedTags = Array.from(selectedTags).every(selectedTag => 
        courseTagNames.includes(selectedTag.toLowerCase())
      );
    }
  }
  return matchesSearch && matchesSelectedTags;
};

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]); // Descomentado
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiFetch('/courses'); // Usa a nova função
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
        }
        const data: Course[] = await response.json();
        setAllCourses(data);
        setFilteredCourses(data); // Inicializar filteredCourses
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unknown error occurred while fetching courses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Extrair todas as tags únicas dos cursos
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allCourses.forEach(course => {
      // Course agora deve ter tags: Tag[] onde Tag é {id, name}
      course.tags?.forEach(tag => tagsSet.add(tag.name)); 
    });
    return Array.from(tagsSet).sort((a,b) => a.localeCompare(b));
  }, [allCourses]);

  if (isLoading) {
    return <p className="text-center text-default-500 mt-8">Loading courses...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Explore Our Courses</h1>
      
      <FilterBar
        items={allCourses} // Passar todos os cursos para a FilterBar poder filtrar
        filterFn={filterCourses} 
        onFilterChange={setFilteredCourses} // Atualizar o estado dos cursos filtrados
        availableTags={availableTags} // Passar os nomes das tags disponíveis
        placeholderText="Filter courses by title, description, or tag..."
        tagColor="secondary" 
      /> 

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredCourses.map((course) => ( // Mapear sobre filteredCourses
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center text-default-500 mt-8">
          {allCourses.length > 0 && filteredCourses.length === 0 ? 
            "No courses found matching your filters." : 
            "No courses available at the moment. Please check back later!"
          }
        </p>
      )}
    </div>
  );
} 