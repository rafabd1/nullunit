import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@heroui/input';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { SearchIcon, XIcon } from 'lucide-react';

interface FilterBarProps<T> {
  items: T[]; // Lista completa de itens (ArticleModule ou PortfolioProject)
  filterFn: (item: T, searchTerm: string, selectedTags: Set<string>) => boolean; // Função de filtro customizada
  onFilterChange: (filteredItems: T[]) => void; // Callback com itens filtrados
  availableTags: string[]; // Todas as tags únicas disponíveis
  placeholderText: string;
  tagColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'; // Cor dos chips de tag
}

export function FilterBar<T>({ 
  items, 
  filterFn, 
  onFilterChange, 
  availableTags, 
  placeholderText,
  tagColor = 'default' 
}: FilterBarProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Memoize available tags to avoid unnecessary re-renders
  const uniqueSortedTags = useMemo(() => {
    const uniqueTags = Array.from(new Set(availableTags));
    return uniqueTags.sort((a, b) => a.localeCompare(b));
  }, [availableTags]);

  // Effect to apply filters when searchTerm or selectedTags change
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = items.filter(item => filterFn(item, lowerSearchTerm, selectedTags));
    onFilterChange(filtered);
  }, [searchTerm, selectedTags, items, filterFn, onFilterChange]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prevTags => {
      const newTags = new Set(prevTags);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags(new Set());
  };

  return (
    <div className="mb-8">
      {/* Input de Busca */}
      <div className="mb-4">
        <Input
          aria-label="Search filter"
          placeholder={placeholderText}
          value={searchTerm}
          onValueChange={setSearchTerm}
          isClearable
          onClear={() => setSearchTerm('')}
          startContent={<SearchIcon size={18} className="text-default-400" />}
          variant="bordered"
          fullWidth
          classNames={{
            base: "bg-transparent",
            inputWrapper: "border-default-200 hover:border-default-400 transition-colors"
          }}
        />
      </div>

      {/* Filtro de Tags com Clear Filters na mesma linha */}
      {uniqueSortedTags.length > 0 && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-default-600">Filter by Tags:</p>
            {(searchTerm || selectedTags.size > 0) && (
              <Button 
                variant="light" 
                color="danger" 
                size="sm"
                onPress={clearFilters}
                startContent={<XIcon size={14}/>}
                className="absolute right-0 top-0"
              >
                Clear Filters
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pr-32">
            {uniqueSortedTags.map((tag) => {
              const isSelected = selectedTags.has(tag);
              return (
                <Chip
                  key={tag}
                  color={tagColor}
                  variant={isSelected ? 'solid' : 'flat'}
                  onClick={() => handleTagClick(tag)}
                  className="cursor-pointer transition-transform hover:scale-105"
                  size="sm"
                >
                  {tag}
                </Chip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}