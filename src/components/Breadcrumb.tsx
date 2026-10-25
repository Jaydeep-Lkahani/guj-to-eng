import { Link } from "react-router";
import { CaretRight, House } from "@phosphor-icons/react";

export type Crumb = { label: string; to?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="તમે અહીં છો" className="breadcrumb">
      <ol>
        {items.map((item, i) => (
          <li key={i}>
            {i > 0 && <CaretRight weight="bold" className="crumb-sep" aria-hidden="true" />}
            {item.to ? (
              <Link to={item.to}>
                {i === 0 && <House weight="duotone" aria-hidden="true" />}
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
