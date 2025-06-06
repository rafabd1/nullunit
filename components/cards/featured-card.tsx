import NextLink from "next/link";
import { type ReactElement } from "react";

interface FeaturedCardProps {
  tag: string;
  title: string;
  description: string;
  href: string;
}

export function FeaturedCard({
  tag,
  title,
  description,
  href,
}: FeaturedCardProps): ReactElement {
  return (
    <NextLink
      href={href}
      className="group flex h-full flex-col rounded-xl border border-default-200 bg-default-100/50 p-6 transition-colors hover:border-primary hover:bg-default-200/50"
    >
      <div className="flex-1">
        <p className="mb-2 text-sm font-medium text-primary">{tag}</p>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </div>
    </NextLink>
  );
} 