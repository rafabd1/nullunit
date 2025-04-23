'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const errorMessages: { [key: string]: string } = {
  invalid_parameters: 'Parâmetros de verificação inválidos.',
  verification_failed: 'Falha na verificação do email.',
  user_not_found: 'Usuário não encontrado.',
  username_not_found: 'Nome de usuário não encontrado.',
  profile_creation_failed: 'Falha ao criar o perfil.',
  email_not_confirmed: 'Email ainda não confirmado.',
  unexpected_error: 'Ocorreu um erro inesperado.',
};

/**
 * @description Error page shown when authentication fails
 */
export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorMessage = error ? errorMessages[error] || error : 'Ocorreu um erro na autenticação.';

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          Erro na Verificação
        </h1>
        <p className="mb-6">
          {errorMessage}
        </p>
        <div className="space-x-4">
          <Link 
            href="/signup" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </Link>
          <Link 
            href="/" 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
