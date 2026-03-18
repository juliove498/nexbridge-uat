"use client";

import { useEffect, useCallback, useState, useRef } from "react";

export default function LocatorOverlay() {
  const [active, setActive] = useState(false);
  const [target, setTarget] = useState<{
    el: HTMLElement;
    rect: DOMRect;
    source: string;
  } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const getSource = useCallback(
    (el: HTMLElement): { element: HTMLElement; source: string } | null => {
      let current: HTMLElement | null = el;
      while (current) {
        const src = current.getAttribute("data-locatorjs");
        if (src) return { element: current, source: src };
        current = current.parentElement;
      }
      return null;
    },
    [],
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        setActive(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) {
        setActive(false);
        setTarget(null);
      }
    };
    const onBlur = () => {
      setActive(false);
      setTarget(null);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const onMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement | null;
      if (!el || overlayRef.current?.contains(el)) return;
      const found = getSource(el);
      if (found) {
        setTarget({
          el: found.element,
          rect: found.element.getBoundingClientRect(),
          source: found.source,
        });
      } else {
        setTarget(null);
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!e.altKey) return;
      const el = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement | null;
      if (!el || overlayRef.current?.contains(el)) return;
      const found = getSource(el);
      if (!found) return;

      e.preventDefault();
      e.stopPropagation();

      const [filePath, line, col] = parseSource(found.source);
      window.open(`vscode://file${filePath}:${line}:${col}`, "_self");
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick, true);
    };
  }, [active, getSource]);

  if (process.env.NODE_ENV !== "development" || !active) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "none",
      }}
    >
      {target && (
        <>
          <div
            style={{
              position: "fixed",
              left: target.rect.left - 1,
              top: target.rect.top - 1,
              width: target.rect.width + 2,
              height: target.rect.height + 2,
              border: "2px solid #E8642C",
              borderRadius: 4,
              pointerEvents: "none",
              transition: "all 0.08s ease-out",
            }}
          />
          <div
            style={{
              position: "fixed",
              left: target.rect.left,
              top: Math.max(0, target.rect.top - 28),
              background: "#E8642C",
              color: "#fff",
              fontSize: 11,
              fontFamily: "monospace",
              padding: "3px 8px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {formatSource(target.source)}
          </div>
        </>
      )}
    </div>
  );
}

function parseSource(source: string): [string, string, string] {
  const match = source.match(/^(.+):(\d+):(\d+)$/);
  if (!match) return [source, "1", "1"];
  return [match[1], match[2], match[3]];
}

function formatSource(source: string): string {
  const [filePath, line, col] = parseSource(source);
  const short = filePath.replace(/^.*\/nexbridge-landing-nextjs\//, "");
  return `${short}:${line}:${col}`;
}
