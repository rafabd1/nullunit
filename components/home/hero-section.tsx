"use client";

import NextLink from "next/link";
import { Button } from "@heroui/react";
import { type ReactElement } from "react";

export function HeroSection(): ReactElement {
  return (
    <section>
      <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl">
        Learn cybersecurity.
      </h1>
      <p className="mt-6 mb-6 max-w-2xl text-lg text-muted-foreground">
        Your platform for learning and collaborating in cybersecurity. Explore
        articles, courses, and tools.
      </p>
      <Button
        as={NextLink}
        href="/courses"
        variant="shadow"
        className="shadow-[4px_4px_8px_rgba(0,0,0,0.25)]"
      >
        Get Started
      </Button>
    </section>
  );
} 