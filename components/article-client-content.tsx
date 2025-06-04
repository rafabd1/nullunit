'use client'; // Este é agora um Componente de Cliente

import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@heroui/button';
import { Copy, Check } from 'lucide-react';
import { Chip } from '@heroui/chip';
// import { User } from '@heroui/user'; // Remover se não for usado para autor
import NextLink from 'next/link';
import { Link } from '@heroui/link';
import clsx from 'clsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Importar os novos tipos
import { Article, Tag } from '@/types/article';

// Estrutura para um item da Tabela de Conteúdos (ToC)
interface TocEntry {
  id: string;
  level: number; // ex: 1 para h1, 2 para h2
  text: string;
}

// --- Componente Customizado CodeBlock (mantido igual) --- 
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

// Função para gerar slug a partir de texto (simples)
const generateSlug = (text: string) => {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '-') // Substituir espaços por hífens
    .replace(/[^\w\-]+/g, ''); // Remover caracteres não alfanuméricos (exceto hífen)
};


// --- Props para o componente cliente (atualizadas) --- 
interface ArticleClientContentProps {
  article: Article;
}

// --- Componente que renderiza o conteúdo do artigo --- 
export const ArticleClientContent = ({ article }: ArticleClientContentProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoizar a extração de ToC para evitar re-cálculos desnecessários
  const tocEntries = useMemo<TocEntry[]>(() => {
    if (!isMounted || !article.content) return []; // Só processa no cliente e se tiver conteúdo
    
    const headings: TocEntry[] = [];
    // Regex simples para capturar h1, h2, h3. Pode ser melhorado ou substituído por parsing de Markdown.
    const headingRegex = /^(#{1,3})\s+(.*)$/gm;
    let match;
    while ((match = headingRegex.exec(article.content)) !== null) {
      const level = match[1].length; // #{1,3} -> nível 1, 2 ou 3
      const text = match[2].trim();
      const id = generateSlug(text); 
      headings.push({ id, level, text });
    }
    return headings;
  }, [article.content, isMounted]);

  // Efeito para observar os elementos de cabeçalho e atualizar o ToC ativo
  useEffect(() => {
    if (!isMounted || tocEntries.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -75% 0px" } // Ativa quando o cabeçalho está no topo 25% da viewport
    );

    tocEntries.forEach(toc => {
      const element = document.getElementById(toc.id);
      if (element) observer.observe(element);
    });

    return () => {
      tocEntries.forEach(toc => {
        const element = document.getElementById(toc.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [isMounted, tocEntries]);


  const handleTocClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Custom renderer para cabeçalhos para injetar IDs
  const headingRenderer = ({ level, children }: { level: number; children: React.ReactNode[] }) => {
    const text = children.map(c => typeof c === 'string' ? c : '').join('');
    const id = generateSlug(text);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isReactText, ...actualChildren] = children; // Para evitar erro de tipo de ReactText vs ReactNode

    switch (level) {
      case 1:
        return <h1 id={id}>{actualChildren}</h1>;
      case 2:
        return <h2 id={id}>{actualChildren}</h2>;
      case 3:
        return <h3 id={id}>{actualChildren}</h3>;
      // Adicione mais casos se precisar de h4, h5, h6
      default:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore // Permite que o React renderize children normalmente para outros níveis
        return React.createElement(`h${level}`, { id }, actualChildren);
    }
  };

  if (!isMounted) {
    // Pode retornar um loader ou null enquanto não estiver montado para evitar hydration mismatch
    // especialmente se o ToC depende de cálculos no cliente.
    return null; 
  }

  return (
    <div className="flex flex-col md:flex-row gap-x-8 gap-y-4 w-full">
      {/* Sidebar para ToC */}
      {tocEntries.length > 0 && (
        <aside className="w-full md:w-1/4 lg:w-1/5 md:sticky md:top-24 self-start flex-shrink-0 order-last md:order-first">
          <h3 className="text-base font-semibold mb-3 tracking-tight">Nesta página</h3>
          <nav>
            <ul className="space-y-1.5">
              {tocEntries.map((entry) => (
                <li key={entry.id} style={{ marginLeft: `${(entry.level - 1) * 0.75}rem` }}>
                  <Link
                    href={`#${entry.id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        handleTocClick(entry.id);
                    }}
                    className={clsx(
                      'block text-sm hover:text-primary transition-colors',
                      {
                        'text-primary font-medium': entry.id === activeTocId,
                        'text-default-600 hover:text-default-900': entry.id !== activeTocId
                      }
                    )}
                  >
                    {entry.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Conteúdo Principal */}
      <article className={clsx(
        "w-full",
        tocEntries.length > 0 ? "md:w-3/4 lg:w-4/5" : "max-w-full" // Ocupa mais espaço se não houver ToC
      )}>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight leading-tight">{article.title}</h1>
        
        {/* Metadados */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6 text-sm text-default-600">
          {/* Autor: Placeholder ou buscar e exibir nome do autor se necessário */}
          {/* <span>By Member: {article.member_id}</span> */}
          <span>Publicado em {new Date(article.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <Chip key={tag.id} color="primary" variant="flat" size="sm" as={NextLink} href={`/tags/${tag.slug}`}>
                {tag.name}
              </Chip>
            ))}
          </div>
        )}
        
        {/* Conteúdo Markdown */}
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock,
              h1: (props) => headingRenderer({ ...props, level: 1 }),
              h2: (props) => headingRenderer({ ...props, level: 2 }),
              h3: (props) => headingRenderer({ ...props, level: 3 }),
              // Adicione h4, h5, h6 se necessário
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}; 