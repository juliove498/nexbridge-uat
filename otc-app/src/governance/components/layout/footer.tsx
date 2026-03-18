import { useTranslation } from "@/governance/hooks/use-translation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border mt-12 pt-6 pb-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>{t.footer.tagline}</p>
        <div className="flex items-center gap-4">
          <span>{t.footer.poweredBy}</span>
          <span className="h-3 w-px bg-border" />
          <span>{t.footer.liquidNetwork}</span>
        </div>
      </div>
    </footer>
  );
}
