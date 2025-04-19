/* eslint-disable prettier/prettier */
import { ArticleModule } from '@/types/article';

export const mockArticleModules: ArticleModule[] = [
  {
    slug: 'sql-injection-basics',
    title: 'SQL Injection: Fundamentals',
    description: 'Learn the basic concepts and most common types of SQL Injection.',
    subArticles: [
      {
        slug: 'introduction',
        title: 'Introduction to SQL Injection',
        content: `# Introduction to SQL Injection

This is the content of the first sub-article about SQL Injection introduction. We'll talk about what it is, why it's dangerous and how it works at a high level.

* What is SQLi?
* SQLi Impact
* Simple Examples
`,
      },
      {
        slug: 'union-based',
        title: 'Union-Based SQLi',
        content: `# Union-Based SQLi

Exploring the Union-Based technique to extract data from different tables.

\`\`\`sql
SELECT username, password FROM users WHERE id = 1 UNION SELECT version(), @@hostname;
\`\`\`
`,
      },
      {
        slug: 'error-based',
        title: 'Error-Based SQLi',
        content: `# Error-Based SQLi

How to exploit database errors to infer information.
`,
      },
    ],
  },
  {
    slug: 'cross-site-scripting',
    title: 'Cross-Site Scripting (XSS)',
    description: 'Understand the different types of XSS and how to prevent attacks.',
    subArticles: [
      {
        slug: 'reflected-xss',
        title: 'Reflected XSS',
        content: `# Reflected XSS

Demonstration of how Reflected XSS works.

\`\`\`html
<script>alert('XSS')</script>
\`\`\`
`,
      },
      {
        slug: 'stored-xss',
        title: 'Stored XSS',
        content: `# Stored XSS

Understanding Stored XSS, where malicious script is stored on the server.
`,
      },
      {
        slug: 'dom-based-xss',
        title: 'DOM-Based XSS',
        content: `# DOM-Based XSS

Exploring XSS that occurs on the client side by manipulating the DOM.
`,
      },
    ],
  },
  // Add more modules and sub-articles here as needed
];