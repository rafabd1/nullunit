'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * @description Success page shown after email verification
 */
export default function AuthSuccess() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">
          {message === 'already_verified' 
            ? 'Conta já verificada!'
            : 'Verificação concluída com sucesso!'}
        </h1>
        <p className="mb-6">
          {message === 'already_verified'
            ? 'Sua conta já estava verificada. Você pode fazer login agora.'
            : 'Sua conta foi verificada com sucesso. Você já pode fazer login.'}
        </p>
        <Link 
          href="/login" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Fazer Login
        </Link>
      </div>
    </div>
  );
}
