import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { JsonLd, getBreadcrumbJsonLd } from './json-ld';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ name: 'Home', url: '/' }, ...items];

  return (
    <>
      <JsonLd data={getBreadcrumbJsonLd(allItems)} />
      <nav aria-label="Breadcrumbs" className="mb-stack flex items-center text-small text-fg-2">
        <ol className="flex flex-wrap items-center gap-x-1.5">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const label = item.name;
            return (
              <li key={item.url} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-4 w-4 text-fg-3" aria-hidden="true" />}
                {isLast ? (
                  <span className="font-semibold text-fg-1" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="inline-flex min-h-tap items-center gap-1 rounded-control text-fg-2 underline-offset-2 transition-colors duration-120 hover:text-fg-1 hover:underline md:min-h-0 md:py-1"
                  >
                    {index === 0 && <Home className="h-4 w-4" aria-hidden="true" />}
                    <span>{label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
