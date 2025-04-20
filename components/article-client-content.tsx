'use client'; // Este é agora um Componente de Cliente

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@heroui/button';
import { Copy, Check } from 'lucide-react';
import { Chip } from '@heroui/chip';
import { User } from '@heroui/user';
import NextLink from 'next/link';
import { Link } from '@heroui/link';
import clsx from 'clsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// --- Componente Customizado CodeBlock (igual ao anterior) --- 
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    });
  };

  if (!inline && match) {
    return (
      <div className="relative group">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--default-200)',
            background: '#1e1e1e'
          }}
          codeTagProps={{
            style: {
              background: 'transparent',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              fontFamily: 'var(--font-mono)',
            }
          }}
          PreTag="div"
        >
          {codeString}
        </SyntaxHighlighter>
        <Button 
          isIconOnly
          size="sm"
          variant="light"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-default-500 hover:text-primary"
          onPress={handleCopy}
          aria-label="Copy code"
        >
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
    );
  }

  return (
    <code className={className} {...props}>{children}</code>
  );
};

// --- Props para o componente cliente --- 
interface ArticleClientContentProps {
  module: ArticleModule;
  subArticle: SubArticle;
  moduleSlug: string;
  subArticleSlug: string;
}

// --- Componente que renderiza o conteúdo do artigo --- 
export const ArticleClientContent = ({ 
  module, 
  subArticle, 
  moduleSlug, 
  subArticleSlug 
}: ArticleClientContentProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
        <h3 className="text-lg font-semibold mb-4">{module.title}</h3>
        <nav>
          <ul>
            {module.subArticles.map((sa) => (
              <li key={sa.slug} className="mb-2">
                <Link
                  as={NextLink}
                  href={`/articles/${moduleSlug}/${sa.slug}`}
                  className={clsx(
                    'block px-3 py-1 rounded hover:bg-default-100',
                    {
                      'bg-primary text-primary-foreground font-medium': sa.slug === subArticleSlug,
                      'text-default-700': sa.slug !== subArticleSlug
                    }
                  )}
                >
                  {sa.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <article className="w-full md:w-3/4 lg:w-4/5">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{subArticle.title}</h1>
        {/* Metadados */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-sm text-default-600">
          {subArticle.author && (
            <span>By {subArticle.author}</span>
          )}
          {subArticle.publishedDate && (
            <span>• Published on {new Date(subArticle.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          )}
        </div>
        {subArticle.tags && subArticle.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {subArticle.tags.map((tag) => (
              <Chip key={tag} color="primary" variant="flat" size="sm">
                {tag}
              </Chip>
            ))}
          </div>
        )}
        {/* Markdown com CodeBlock */}
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock,
            }}
          >
            {subArticle.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}; 