"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  { href: "/groups", label: "Groups" },
];

function selectedLink(pathname: string, href: string) {
  return pathname.includes(href) ? "text-foreground" : "text-muted-foreground";
}

export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${selectedLink(
            pathname,
            href
          )} transition-colors hover:text-foreground`}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
