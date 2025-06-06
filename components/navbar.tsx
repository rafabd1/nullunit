/* eslint-disable react/jsx-sort-props */
"use client";
/* eslint-disable import/order */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";

// Importar dados para busca
import { mockArticleModules } from "@/lib/mock-articles";
import { mockPortfolioProjects } from "@/lib/mock-portfolio";

// Tipos para resultados da busca
interface SearchResult {
  type: "article" | "project";
  title: string;
  href: string;
  description?: string;
}

import { useAuth } from "@/providers/auth-provider";
import { Avatar } from "@heroui/avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { createClient } from "@/lib/supabase/client"; // Importar o cliente

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading } = useAuth();
  const supabase = createClient(); // Instanciar o cliente

  // Função de busca Memoizada
  const performSearch = useMemo(() => {
    return (query: string): SearchResult[] => {
      if (!query) return [];
      const lowerQuery = query.toLowerCase();
      const results: SearchResult[] = [];
      const addedArticleHrefs = new Set<string>(); // Para evitar duplicatas se sub-artigo e módulo derem match

      // Buscar em Artigos (títulos e tags dos MÓDULOS e SUB-ARTIGOS)
      mockArticleModules.forEach((module) => {
        // Verificar se o MÓDULO corresponde (título ou tag)
        const moduleMatches = 
          module.title.toLowerCase().includes(lowerQuery) ||
          module.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));

        // Se o módulo corresponde, adiciona o link para o primeiro sub-artigo (se ainda não adicionado)
        if (moduleMatches) {
          const href = `/articles/${module.slug}/${module.subArticles[0].slug}`;
          if (!addedArticleHrefs.has(href)) {
            results.push({
              type: "article",
              title: module.title, // Mostrar título do módulo
              href: href,
              description: `Article Module: ${module.description || 'View module'}`,
            });
            addedArticleHrefs.add(href);
          }
        }

        // Verificar se algum SUB-ARTIGO corresponde (título ou tag) - Opcional se busca por módulo é suficiente
        // Pode levar a muitos resultados, talvez comentar se a busca por módulo for preferível
        module.subArticles.forEach((sub) => {
          const subArticleMatches = 
             sub.title.toLowerCase().includes(lowerQuery) ||
             sub.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));
          
          if (subArticleMatches) {
            const href = `/articles/${module.slug}/${sub.slug}`;
            // Adiciona apenas se o link exato ainda não foi adicionado (evita duplicar se módulo e sub derem match)
            if (!addedArticleHrefs.has(href)) {
               results.push({
                 type: "article",
                 title: `${module.title}: ${sub.title}`, // Título mais específico
                 href: href,
                 description: `Article in ${module.title}`,
               });
               addedArticleHrefs.add(href);
            }
          }
        });
      });

      // Buscar em Projetos (título, descrição, tags)
      mockPortfolioProjects.forEach((project) => {
        if (
          project.title.toLowerCase().includes(lowerQuery) ||
          project.description.toLowerCase().includes(lowerQuery) ||
          project.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        ) {
          results.push({
            type: "project",
            title: project.title,
            href: project.repoUrl, // Link direto para o repo
            description: `Project: ${project.description.substring(0, 50)}...`,
          });
        }
      });

      // Remover duplicatas exatas (embora o Set já ajude com artigos)
      const uniqueResults = results.filter((result, index, self) => 
        index === self.findIndex((r) => r.href === result.href && r.title === result.title)
      );

      // Limitar número de resultados
      return uniqueResults.slice(0, 10);
    };
  }, []); 

  // Atualizar resultados quando a query mudar (com debounce simples)
  useEffect(() => {
    const handler = setTimeout(() => {
      const results = performSearch(searchQuery);
      setSearchResults(results);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, performSearch]);

  // --- Atalho Global (Cmd/Ctrl + K) ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener na desmontagem
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Executar apenas uma vez

  // Handler para seleção de item no Autocomplete
  const handleSelectionChange = (key: React.Key | null) => {
    if (key === null) return; // Ignorar se nada for selecionado

    const item = searchResults.find((res) => res.href === key);

    if (item) {
      setSearchQuery(""); // Limpar busca
      inputRef.current?.blur(); // Tirar foco
      if (item.type === "project") {
        window.open(item.href, "_blank");
      } else {
        router.push(item.href);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // O onAuthStateChange no AuthProvider vai detectar o logout e atualizar o estado.
    // O router.refresh() ajuda a garantir que qualquer conteúdo renderizado no servidor
    // também seja atualizado para o estado de "não logado".
    router.push('/');
    router.refresh(); 
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">NullUnit</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex w-full max-w-[320px] items-center">
          <Autocomplete
            aria-label="Search"
            placeholder="Search content..."
            variant="bordered"
            size="sm"
            items={searchResults}
            inputValue={searchQuery}
            onInputChange={setSearchQuery}
            onSelectionChange={handleSelectionChange}
            inputProps={{
              ref: inputRef,
              startContent: (
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0 mr-2" />
              ),
            }}
            listboxProps={{
              hideEmptyContent: true,
              itemClasses: {
                base: [
                  "rounded-md",
                  "text-default-500",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "data-[hover=true]:bg-default-100",
                  "dark:data-[hover=true]:bg-default-50",
                  "data-[selectable=true]:focus:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              },
            }}
            popoverProps={{
              offset: 10,
              disableAnimation: true,
              shouldCloseOnBlur: false,
              className: "max-h-[400px]",
            }}
          >
            {(item) => (
              <AutocompleteItem key={item.href} textValue={item.title}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                {item.description && (
                  <div className="text-xs text-default-500 mt-0.5">
                    {item.description}
                  </div>
                )}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <Kbd
            className="ml-2"
            keys={["command"]}
            style={{
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            K
          </Kbd>
        </NavbarItem>
        
        {isLoading ? (
          <NavbarItem>
            <div className="w-[36px] h-[36px] bg-default-200 rounded-full animate-pulse" />
          </NavbarItem>
        ) : user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <NavbarItem>
                <Avatar
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  size="sm"
                  src={user.user_metadata?.avatar_url || ''} // Usar avatar do supabase se houver
                  name={user.user_metadata?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                />
              </NavbarItem>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.user_metadata?.username || user.email}</p>
              </DropdownItem>
              <DropdownItem key="dashboard" as={NextLink} href="/dashboard">Dashboard</DropdownItem>
              <DropdownItem key="settings" as={NextLink} href="/settings">Settings</DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem className="hidden md:flex">
            <Button
              as={NextLink}
              className="text-sm font-normal text-default-600 bg-default-100"
              href="/auth/login"
              variant="flat"
            >
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
           {/* Adicionar busca ao menu mobile */}
           <NavbarMenuItem className="mt-4">
             <Autocomplete
                aria-label="Search Mobile"
                placeholder="Search content..."
                variant="bordered"
                size="sm"
                items={searchResults}
                inputValue={searchQuery}
                onInputChange={setSearchQuery}
                onSelectionChange={handleSelectionChange}
                inputProps={{ /* startContent etc. como no desktop */ }}
                listboxProps={{ /* ... */ }}
                popoverProps={{ /* ... */ }}
              >
                 {(item) => (
                   <AutocompleteItem key={item.href} textValue={item.title}>
                      {/* ... layout do item ... */}
                      {item.title}
                   </AutocompleteItem>
                 )}
              </Autocomplete>
           </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
