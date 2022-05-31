import Link from "next/link";
import React from "react";

export interface NavLinkItem {
  label: string;
  url: string;
}

export interface NavLinksProps {
  links: NavLinkItem[];
}

export const NavLinks = ({ links }: NavLinksProps): JSX.Element => {
  return (
    <div>
      {links.map((link) => (
        <Link key={link.url} href={link.url}>
          <a>{link.label}</a>
        </Link>
      ))}
    </div>
  );
};
