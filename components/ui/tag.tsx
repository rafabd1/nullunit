import NextLink from "next/link";
import { tv, type VariantProps } from "tailwind-variants";

const tagVariants = tv({
  base: "inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
  variants: {
    color: {
      default:
        "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      primary:
        "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  name: string;
  slug: string;
}

export const Tag = ({ name, slug, color, className }: TagProps) => {
  return (
    <NextLink
      href={`/tags/${slug}`}
      className={tagVariants({ color, className })}
    >
      {name}
    </NextLink>
  );
}; 