import Link from 'next/link';
import { allArticles, Article } from '../../../.contentlayer/generated';
import { compareDesc, format, parseISO } from 'date-fns';

function ArticleCard(article: Article) {
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link href={article.url} className="text-blue-700 hover:text-blue-900 dark:text-blue-400">
          {article.title}
        </Link>
      </h2>
      <time dateTime={article.date} className="mb-2 block text-xs text-gray-600">
        {format(parseISO(article.date), 'LLLL d, yyyy')}
      </time>
      <div
        className="text-sm [&>*]:mb-3 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: article.description }}
      />
    </div>
  );
}

export default function ArticlesPage() {
  const articles = allArticles.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Articles</h1>

      {articles.map((article, idx) => (
        <ArticleCard key={idx} {...article} />
      ))}
    </div>
  );
} 