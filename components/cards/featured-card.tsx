import NextLink from "next/link";
import { type ReactElement } from "react";
import { BookMarked, FolderGit2, FileText } from "lucide-react";

interface FeaturedCardBaseProps {
  tag: "Course" | "Project" | "Article";
  title: string;
  href: string;
}

const tagIconMap = {
  Course: BookMarked,
  Project: FolderGit2,
  Article: FileText,
};

export function FeaturedCardLarge({
  tag,
  title,
  href,
}: FeaturedCardBaseProps): ReactElement {
  const Icon = tagIconMap[tag];

  return (
    <NextLink
      href={href}
      className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-8 transition-colors hover:border-primary/70"
    >
      <div>
        <h2 className="text-4xl font-bold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h2>
      </div>
      <div className="mt-8 flex items-center text-sm text-muted-foreground">
        <Icon className="mr-2 h-4 w-4" />
        <span>{tag}</span>
      </div>
    </NextLink>
  );
}

export function FeaturedCardSmall({
  tag,
  title,
  href,
}: FeaturedCardBaseProps): ReactElement {
  const Icon = tagIconMap[tag];

  return (
    <NextLink
      href={href}
      className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/70"
    >
      <div>
        <h3 className="mb-4 text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
      </div>
      <div className="mt-4 flex items-center text-sm text-muted-foreground">
        <Icon className="mr-2 h-4 w-4" />
        <span>{tag}</span>
      </div>
    </NextLink>
  );
} 