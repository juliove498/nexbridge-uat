"use client";

import { useEffect, useState } from "react";

export function HomeEffects() {
  useEffect(() => {
    const hero = document.querySelector(".hero") as HTMLElement | null;
    const onHeroMove = (e: MouseEvent) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--hero-mx", e.clientX - rect.left + "px");
      hero.style.setProperty("--hero-my", e.clientY - rect.top + "px");
    };
    hero?.addEventListener("mousemove", onHeroMove);

    const addCardGlow = (selector: string, xVar: string, yVar: string) => {
      const cards = document.querySelectorAll<HTMLElement>(selector);
      const handlers = new Map<HTMLElement, (e: MouseEvent) => void>();
      cards.forEach((card) => {
        const handler = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty(
            xVar,
            ((e.clientX - rect.left) / rect.width) * 100 + "%",
          );
          card.style.setProperty(
            yVar,
            ((e.clientY - rect.top) / rect.height) * 100 + "%",
          );
        };
        card.addEventListener("mousemove", handler);
        handlers.set(card, handler);
      });
      return () => {
        handlers.forEach((handler, card) =>
          card.removeEventListener("mousemove", handler),
        );
      };
    };

    const cleanupProducts = addCardGlow(
      ".product-card",
      "--mouse-x",
      "--mouse-y",
    );
    const cleanupFeatures = addCardGlow(
      ".feature-item",
      "--feat-mx",
      "--feat-my",
    );
    const cleanupPartners = addCardGlow(".marquee-logo-card", "--mx", "--my");

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const onScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const top = (section as HTMLElement).offsetTop - 200;
        if (window.scrollY >= top) current = section.getAttribute("id") || "";
      });
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current)
          link.classList.add("active");
      });
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      hero?.removeEventListener("mousemove", onHeroMove);
      cleanupProducts();
      cleanupFeatures();
      cleanupPartners();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}

export function UstblNavValue() {
  const [nav, setNav] = useState("$32M+");

  useEffect(() => {
    fetch("/api/ticker/USTBL")
      .then((res) => res.json())
      .then((data) => {
        const navNum = parseFloat(data.nav);
        if (!isNaN(navNum)) {
          setNav("$" + (navNum / 1e6).toFixed(1) + "M+");
        }
      })
      .catch(() => {});
  }, []);

  return <>{nav}</>;
}
