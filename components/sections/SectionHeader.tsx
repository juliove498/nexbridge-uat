import type { ReactNode } from "react";

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div
      className={`reveal max-w-160 ${centered ? "text-center mx-auto" : ""}`}
    >
      <div className={`section-label ${centered ? "justify-center" : ""}`}>
        {label}
      </div>
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p className={`section-subtitle ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
