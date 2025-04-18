'use client'; // Add this directive for useEffect

import { notFound } from 'next/navigation';
import { allArticles } from 'contentlayer/generated'; // Corrected import path
import { useMDXComponent } from 'next-contentlayer/hooks';
import { format, parseISO } from 'date-fns';
import { useEffect } from 'react'; // Import useEffect
import hljs from 'highlight.js'; // Import highlight.js

/**
 * Renders the article content with client-side syntax highlighting.
 * @param {object} props - Component props.
 * @param {object} props.params - Route parameters.
 * @param {string} props.params.slug - The article slug.
 * @returns {JSX.Element} The rendered article page.
 */
export default function ArticleLayout({ params }: { params: { slug: string } }) {
  const article = allArticles.find((article) => article._raw.flattenedPath.replace('articles/', '') === params.slug);

  if (!article) {
    notFound();
  }

  const MDXContent = useMDXComponent(article.body.code);

  useEffect(() => {
    // Apply highlighting to all code blocks on component mount
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, []); // Empty dependency array ensures this runs only once after mount

  return (
    <article className="prose dark:prose-invert mx-auto max-w-3xl py-8 px-4 sm:px-6 lg:px-8"> {/* Adjusted max-width and padding */}
      <div className="mb-8 text-center">
        <time dateTime={article.date} className="mb-2 block text-sm text-muted-foreground"> {/* Adjusted styling */}
          {format(parseISO(article.date), 'dd/MM/yyyy')} {/* Changed date format */}
        </time>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{article.title}</h1> {/* Adjusted heading size */}
      </div>
      <div className="mt-8">
        <MDXContent />
      </div>
    </article>
  );
}