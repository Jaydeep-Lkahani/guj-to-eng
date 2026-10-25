import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { List, MagnifyingGlass, X } from "@phosphor-icons/react";
import { Sidebar } from "./Sidebar";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";
import { Footer } from "./Footer";
import { LogoMark, siteName } from "./Logo";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  // New page: close the phone menu and search, and start at the top.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="app">
      <a href="#main" className="skip-link" onClick={(e) => {
        e.preventDefault();
        document.getElementById("main")?.focus();
      }}>
        સીધા પાઠ પર જાઓ
      </a>

      <header className="site-header">
        <button
          ref={menuButton}
          type="button"
          className="icon-button menu-button"
          aria-expanded={menuOpen}
          aria-controls="sidebar"
          aria-label={menuOpen ? "મેનુ બંધ કરો" : "મેનુ ખોલો"}
          onClick={() => {
            setMenuOpen((open) => !open);
            setSearchOpen(false);
          }}
        >
          {menuOpen ? <X weight="bold" aria-hidden="true" /> : <List weight="bold" aria-hidden="true" />}
        </button>

        <Link to="/" className="brand" aria-label={`${siteName} – ઘર`}>
          <LogoMark size={40} className="brand-mark" />
          <span className="brand-text">
            <span className="brand-name">{siteName}</span>
            <span className="brand-tag" lang="en">
              Learn English in Gujarati
            </span>
          </span>
        </Link>

        <SearchBox open={searchOpen} onClose={() => setSearchOpen(false)} />

        <div className="header-actions">
          <button
            type="button"
            className="icon-button search-toggle"
            aria-expanded={searchOpen}
            aria-label={searchOpen ? "શોધ બંધ કરો" : "શોધો"}
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
          >
            {searchOpen ? <X weight="bold" aria-hidden="true" /> : <MagnifyingGlass weight="bold" aria-hidden="true" />}
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="body">
        <nav id="sidebar" className={menuOpen ? "sidebar open" : "sidebar"} aria-label="બધા પાઠ">
          <Sidebar />
        </nav>
        {menuOpen && <div className="backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />}

        <div className="content">
          <main id="main" className="main" tabIndex={-1}>
            <div key={pathname} className="page-enter">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
