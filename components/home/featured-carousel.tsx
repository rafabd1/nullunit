"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import {
  BookMarked,
  FolderGit2,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { type GraphContent } from "./featured-graph"; // Re-using the type

const ICONS: Record<"Article" | "Course" | "Project", LucideIcon> = {
  Course: BookMarked,
  Article: FileText,
  Project: FolderGit2,
};

const CarouselCard = ({
  item,
  isCenter,
}: {
  item: GraphContent;
  isCenter: boolean;
}) => {
  const Icon = ICONS[item.type];
  const basePath = `/${item.type.toLowerCase()}s`;

  return (
    <NextLink href={`${basePath}/${item.slug}`}>
      <motion.div
        className="group flex h-full cursor-pointer flex-col justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/70"
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{
          scale: isCenter ? 1 : 0.95,
          opacity: isCenter ? 1 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div>
          <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Icon className="mr-2 h-4 w-4" />
          <span>{item.type}</span>
        </div>
      </motion.div>
    </NextLink>
  );
};

export const FeaturedCarousel = ({ content }: { content: GraphContent[] }) => {
  const [duplicatedContent, setDuplicatedContent] = useState<GraphContent[]>(
    [],
  );
  const CARD_HEIGHT = 190; // Approx height of one card + gap
  const DURATION = 40; // Seconds for a full loop

  useEffect(() => {
    if (content.length > 0) {
      // We need enough items to create a seamless loop
      setDuplicatedContent([...content, ...content, ...content, ...content]);
    }
  }, [content]);

  if (content.length === 0) return null;

  return (
    <div
      className="relative h-[450px] w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex flex-col gap-6"
        animate={{
          y: [0, -content.length * CARD_HEIGHT],
        }}
        transition={{
          ease: "linear",
          duration: DURATION,
          repeat: Infinity,
        }}
      >
        {duplicatedContent.map((item, index) => (
          <div key={`${item.id}-${index}`} style={{ height: `${CARD_HEIGHT - 24}px` }}>
            <CarouselCard item={item} isCenter={true} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}; 