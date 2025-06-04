/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import NextLink from 'next/link';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { LockIcon, UnlockIcon } from 'lucide-react'; // Ícones para paid/free

import { Course, CoursePreview } from '@/types/course'; // Tipos de Curso

interface CourseCardProps {
  course: Course | CoursePreview;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const cardHref = `/courses/${course.slug}`;

  return (
    <Card className="h-full flex flex-col" shadow="md" isPressable onPress={() => { 
      // Para navegação programática se necessário, ou apenas confiar no Link abaixo
      // Idealmente, o card inteiro é um link ou o botão é o principal call to action.
      // Por simplicidade, usaremos o Link no CardFooter.
    }}>
      <CardHeader className="flex-col items-start px-4 pb-0 pt-4">
        <div className="flex justify-between items-center w-full mb-1">
          <p className="text-xs uppercase font-bold text-default-500">
            {course.tags && course.tags.length > 0 ? course.tags[0].name : 'Course'}
          </p>
          {course.is_paid ? (
            <Chip 
              size="sm" 
              variant="flat" 
              color="warning" 
              startContent={<LockIcon size={12} />}
            >
              Paid
            </Chip>
          ) : (
            <Chip 
              size="sm" 
              variant="flat" 
              color="success" 
              startContent={<UnlockIcon size={12} />}
            >
              Free
            </Chip>
          )}
        </div>
        <NextLink href={cardHref} passHref legacyBehavior>
          <Link as="h4" className="font-bold text-large line-clamp-2 hover:text-primary transition-colors">
            {course.title}
          </Link>
        </NextLink>
      </CardHeader>
      <CardBody className="overflow-visible py-2 flex-grow">
        {course.description && (
          <p className="text-sm text-default-700 line-clamp-3">
            {course.description}
          </p>
        )}
      </CardBody>
      <CardFooter className="flex-col items-start border-t border-default-200 pt-3">
        {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
                {course.tags.slice(0, 3).map((tag) => (
                    <Chip key={tag.id} size="sm" variant="flat">
                        {tag.name}
                    </Chip>
                ))}
                {course.tags.length > 3 && (
                    <Chip size="sm" variant="bordered">+{course.tags.length - 3}</Chip>
                )}
            </div>
        )}
        <NextLink href={cardHref} passHref legacyBehavior>
          <Button as={Link} color="primary" variant="flat" className="w-full">
            View Course
          </Button>
        </NextLink>
      </CardFooter>
    </Card>
  );
}; 