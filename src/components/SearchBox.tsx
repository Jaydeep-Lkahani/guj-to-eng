import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { BookOpenText, MagnifyingGlass, Translate, X } from "@phosphor-icons/react";
import { search, type SearchResult } from "../search";

type Props = {
  // Phone layout: the box opens as a panel under the header.
  open: boolean;
  onClose: () => void;
};

export function SearchBox({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const listId = useId();

  const results = useMemo(() => search(query), [query]);
  const showList = focused && query.trim().length > 0;

  useEffect(() => setActive(0), [query]);

  // Phone: focus the box as soon as the panel opens.
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  // "/" or Ctrl+K / ⌘K jumps to search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]");
      if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (r: SearchResult) => {
    navigate(`/topic/${r.topicId}`);
    setQuery("");
    input.current?.blur();
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      if (query) setQuery("");
      else {
        input.current?.blur();
        onClose();
      }
    }
  };

  const optionId = (i: number) => `${listId}-opt-${i}`;

  return (
    <div
      ref={wrap}
      className={open ? "search open" : "search"}
      role="search"
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <div className="search-field">
        <MagnifyingGlass className="search-icon" weight="bold" aria-hidden="true" />
        <input
          ref={input}
          type="search"
          className="search-input"
          placeholder="પાઠ કે શબ્દ શોધો…"
          aria-label="પાઠ કે શબ્દ શોધો"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results[active] ? optionId(active) : undefined}
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={onKeyDown}
        />
        {query ? (
          <button
            type="button"
            className="search-clear"
            aria-label="શોધ સાફ કરો"
            onClick={() => {
              setQuery("");
              input.current?.focus();
            }}
          >
            <X weight="bold" aria-hidden="true" />
          </button>
        ) : (
          <kbd className="search-kbd" aria-hidden="true">
            /
          </kbd>
        )}
      </div>

      {showList && (
        <div className="search-panel">
          {results.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="શોધનાં પરિણામ" className="search-results">
              {results.map((r, i) => (
                <li
                  key={r.key}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? "search-result active" : "search-result"}
                  onMouseMove={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(r)}
                >
                  <span className={`search-kind kind-${r.kind}`} aria-hidden="true">
                    {r.kind === "topic" ? <BookOpenText weight="duotone" /> : <Translate weight="duotone" />}
                  </span>
                  {r.kind === "topic" ? (
                    <span className="search-text">
                      <span className="search-main">{r.titleGu}</span>
                      <span className="search-sub">
                        <span lang="en">{r.titleEn}</span> · {r.where}
                      </span>
                    </span>
                  ) : (
                    <span className="search-text">
                      <span className="search-main">
                        <span lang="en" className="en">
                          {r.en}
                        </span>{" "}
                        – {r.gu}
                      </span>
                      <span className="search-sub">
                        {r.translit} · {r.where}
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div id={listId} className="search-empty" role="status">
              <p className="search-empty-title">"{query.trim()}" માટે કંઈ મળ્યું નહીં</p>
              <p>બીજો શબ્દ લખી જુઓ, જેમ કે “Apple” કે “આંકડા”.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
