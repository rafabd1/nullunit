import { notFound } from 'next/navigation';
import { allArticles } from '../../../.contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { format, parseISO } from 'date-fns';

export async function generateStaticParams() {
  return allArticles.map((article) => ({
    slug: article._raw.flattenedPath.replace('articles/', ''),
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = allArticles.find((article) => article._raw.flattenedPath.replace('articles/', '') === params.slug);
  if (!article) notFound();
  return { title: article.title, description: article.description };
}

export default function ArticleLayout({ params }: { params: { slug: string } }) {
  const article = allArticles.find((article) => article._raw.flattenedPath.replace('articles/', '') === params.slug);

  if (!article) notFound();

  const MDXContent = useMDXComponent(article.body.code);

  return (
    <article className="prose dark:prose-invert mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <time dateTime={article.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(article.date), 'LLLL d, yyyy')}
        </time>
        <h1 className="text-3xl font-bold">{article.title}</h1>
      </div>
      <MDXContent />
    </article>
  );
} 