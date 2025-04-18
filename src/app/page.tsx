import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center border-b border-border">
        <h1 className="text-2xl font-bold font-mono">NullUnit</h1>
        <nav>
          <Link href="/articles" className="hover:text-primary transition-colors">
            Artigos
          </Link>
          {/* Add other navigation links here if needed */}
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl font-bold mb-4">Bem-vindo ao NullUnit</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Explorando as profundezas da cibersegurança. Artigos, tutoriais e insights sobre o mundo digital seguro.
        </p>
        <Link
          href="/articles"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Ver Artigos Recentes
        </Link>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground border-t border-border">
        <p>&copy; {new Date().getFullYear()} NullUnit. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
