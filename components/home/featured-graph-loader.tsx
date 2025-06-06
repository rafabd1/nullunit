"use client";

import dynamic from "next/dynamic";

const FeaturedGraph = dynamic(
  () => import("@/components/home/featured-graph").then((mod) => mod.FeaturedGraph),
  { 
    ssr: false,
    loading: () => (
      <div className="relative flex h-[450px] w-full items-center justify-center rounded-xl bg-secondary text-muted-foreground -mx-6 lg:-mx-8">
        <p>Loading constellation...</p>
      </div>
    )
  }
);

export const FeaturedGraphLoader = () => {
  return <FeaturedGraph />;
}; 