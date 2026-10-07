export function isNavItemActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  const hrefPath = href.split("?")[0];
  if (hrefPath === "/" || hrefPath === "/nl") return pathname === hrefPath;
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}
