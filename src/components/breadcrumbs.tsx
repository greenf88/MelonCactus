import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items, locale = "en" }: { items: BreadcrumbItem[]; locale?: Locale }) {
  return (
    <nav className="breadcrumbs" aria-label={locale === "nl" ? "Kruimelpad" : "Breadcrumb"}>
      <ol>
        <li><Link href={locale === "nl" ? "/nl" : "/"}>{locale === "nl" ? "Startpagina" : "Home"}</Link></li>
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
