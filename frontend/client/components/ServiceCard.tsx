import React from "react";
import { cn } from "@/lib/utils";

export default function ServiceCard({
  icon,
  title,
  description,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <article className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </article>
  );
}
