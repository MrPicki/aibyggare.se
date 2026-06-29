"use client";

import { useState } from "react";
import Link from "next/link";
import { ModerationButtons } from "./AdminActions";
import type { ModItem } from "@/lib/firebase/admin-data";

const PAGE_SIZE = 10;

export function ContentSection({
  title,
  items,
}: {
  title: string;
  items: ModItem[];
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, PAGE_SIZE);
  const remaining = items.length - PAGE_SIZE;

  return (
    <div>
      <h3 className="font-display text-base font-bold text-ink">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-mud">Inget innehåll än.</p>
      ) : (
        <>
          <ul className="mt-2 space-y-2">
            {visible.map((item) => (
              <li
                key={item.id}
                className="chunky-sm flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper p-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span className="sticker shrink-0 bg-cream px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-mud">
                    {item.label}
                  </span>
                  <Link
                    href={item.url}
                    className="min-w-0 truncate font-semibold text-ink hover:text-build-green"
                  >
                    {item.title}
                  </Link>
                  <span className="hidden shrink-0 font-mono text-[11px] text-mud sm:inline">
                    av {item.author}
                  </span>
                </div>
                <ModerationButtons
                  kind={item.kind}
                  id={item.id}
                  isFeatured={item.isFeatured}
                />
              </li>
            ))}
          </ul>
          {!showAll && remaining > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 font-mono text-xs font-bold text-mud underline-offset-2 hover:text-ink hover:underline"
            >
              Visa {remaining} till
            </button>
          )}
        </>
      )}
    </div>
  );
}
