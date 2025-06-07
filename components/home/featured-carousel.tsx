"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, animate, wrap } from "framer-motion";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  
  // Type guard to ensure item.type is a valid key for ICONS
  if (!(item.type in ICONS)) {
    return null;
  }
  
  const Icon = ICONS[item.type];

  const handleTap = () => {
    if (item.type === "Project" && item.repo_url) {
      window.open(item.repo_url, "_blank", "noopener,noreferrer");
    } else {
      const basePath = `/${item.type.toLowerCase()}s`;
      router.push(`${basePath}/${item.slug}`);
    }
  };

  return (
    <motion.div
      className="group flex h-full cursor-pointer flex-col justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/70"
      initial={{ scale: 0.95, opacity: 0.8 }}
      animate={{
        scale: isCenter ? 1 : 0.95,
        opacity: isCenter ? 1 : 0.6,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      onTap={handleTap}
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
  );
};

export const FeaturedCarousel = ({ content }: { content: GraphContent[] }) => {
  const [duplicatedContent, setDuplicatedContent] = useState<GraphContent[]>(
    [],
  );
  const CARD_HEIGHT = 190; // Approx height of one card + gap
  const DURATION = 40; // Seconds for a full loop
  
  const y = useMotionValue(0);
  const animationControls = useRef<any>(null);

  useEffect(() => {
    if (content.length > 0) {
      const neededForLoop = [...content, ...content];
      setDuplicatedContent(neededForLoop);
    }
  }, [content]);

  useEffect(() => {
    const loopPoint = -content.length * CARD_HEIGHT;

    const startAnimation = () => {
      // Animate from current position to the end of the first content block
      const progress = y.get() / loopPoint;
      const remainingDuration = DURATION * (1 - progress);

      animationControls.current = animate(y, loopPoint, {
        ease: "linear",
        duration: remainingDuration,
        onComplete: () => {
          y.set(0); // Jump back to the start
          // Start the full loop animation
          animationControls.current = animate(y, loopPoint, {
            ease: "linear",
            duration: DURATION,
            repeat: Infinity,
          });
        },
      });
    };
    
    startAnimation();

    return () => animationControls.current?.stop();
  }, [content, y, CARD_HEIGHT, DURATION]);

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
        style={{ y }}
        drag="y"
        onDragStart={() => {
          animationControls.current?.stop();
        }}
        onDragEnd={() => {
           const loopPoint = -content.length * CARD_HEIGHT;
           const currentY = y.get();
           const wrappedY = wrap(loopPoint, 0, currentY);
           if (currentY !== wrappedY) {
               y.set(wrappedY);
           }
           
           // Restart the animation logic after drag
           const progress = wrappedY / loopPoint;
           const remainingDuration = DURATION * (1 - progress);
           
           animationControls.current = animate(y, loopPoint, {
               ease: "linear",
               duration: remainingDuration,
               onComplete: () => {
                   y.set(0);
                   animationControls.current = animate(y, loopPoint, {
                       ease: "linear",
                       duration: DURATION,
                       repeat: Infinity,
                   });
               },
           });
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