import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items, locale = "en" }: { items: BreadcrumbItem[]; locale?: Locale }) {
  const home = locale === "nl"
    ? { label: "Startpagina", href: "/nl" }
    : { label: "Home", href: "/" };
  const trail = [home, ...items];

  return (
    <nav className="breadcrumbs" aria-label={locale === "nl" ? "Kruimelpad" : "Breadcrumb"}>
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        {trail.map((item, index) => (
          <li key={`${item.label}-${index}`} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            {item.href
              ? <Link href={item.href} itemProp="item"><span itemProp="name">{item.label}</span></Link>
              : <span aria-current="page" itemProp="name">{item.label}</span>}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
