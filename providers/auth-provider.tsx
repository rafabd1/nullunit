'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// Supondo que você tenha um tipo para o perfil do membro
// Se não, podemos criar um básico aqui
interface MemberProfile {
  id: string;
  username: string;
  bio?: string;
  website?: string;
  avatar_url?: string;
  // adicione outros campos do perfil aqui
}

type AuthContextType = {
  user: User | null;
  profile: MemberProfile | null;
  isLoading: boolean;
  fetchUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  fetchUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      // Usando 'include' para enviar o cookie de autenticação
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members/me`, {
        credentials: 'include',
      });
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      } else {
        // Se não conseguir buscar o perfil (ex: 404), define como nulo
        setProfile(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile();
      }
      setIsLoading(false);
    }
    
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          // Se o usuário logou, busca o perfil
          await fetchUserProfile();
        } else {
          // Se o usuário deslogou, limpa o perfil
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);

  const value = {
    user,
    profile,
    isLoading,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 