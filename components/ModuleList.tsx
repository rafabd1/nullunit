/* eslint-disable prettier/prettier */
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { PresentationIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

import { CourseModule as CourseModuleType } from '@/types/course';
import { LessonList } from '@/components/LessonList';

interface ModuleListProps {
  modules?: CourseModuleType[];
  courseSlug: string;
}

export const ModuleList: React.FC<ModuleListProps> = ({ modules, courseSlug }) => {
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    setOpenModules(prevOpenModules => {
      const newOpenModules = new Set(prevOpenModules);
      if (newOpenModules.has(moduleId)) {
        newOpenModules.delete(moduleId);
      } else {
        newOpenModules.add(moduleId);
      }
      return newOpenModules;
    });
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="p-6 text-center text-default-500 border border-dashed border-default-300 dark:border-default-700 rounded-lg bg-content1 dark:bg-content1-dark">
        <PresentationIcon size={32} className="mx-auto mb-3 text-default-400" />
        <p className="font-semibold text-lg">No modules available yet.</p>
        <p className="text-sm text-default-600">Course content is being prepared. Please check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {modules.map((module, index) => {
        const isOpen = openModules.has(module.id);
        return (
          <Card key={module.id} shadow="sm" className="bg-content1 dark:bg-content1-dark w-full">
            <CardHeader 
                className="cursor-pointer hover:bg-default-100 dark:hover:bg-default-50 transition-colors p-4" 
                onClick={() => toggleModule(module.id)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-foreground text-md md:text-lg">{module.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Chip size="sm" variant="flat" color="secondary">
                      {module.lessons?.length || 0} lesson(s)
                    </Chip>
                    {module.description && (
                      <p className="text-xs text-default-600 dark:text-default-400 hidden md:block truncate max-w-xs">
                        {module.description}
                      </p>
                    )}
                  </div>
                </div>
                {isOpen ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
              </div>
            </CardHeader>
            {isOpen && (
              <CardBody className="pt-0 px-0 pb-0 border-t border-default-200 dark:border-default-700">
                <LessonList 
                  lessons={module.lessons} 
                  courseSlug={courseSlug} 
                  moduleSlug={module.slug}
                />
              </CardBody>
            )}
          </Card>
        );
      })}
    </div>
  );
}; 