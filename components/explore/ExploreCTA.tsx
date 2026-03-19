import { Link } from "@/i18n/navigation";

interface ExploreCTAProps {
  t: (key: string) => string;
}

export default function ExploreCTA({ t }: ExploreCTAProps) {
  return (
    <section className="py-16 pb-25">
      <div className="container">
        <div
          className="border border-white/6 rounded-xl py-14 px-12 sm:py-9 sm:px-6 text-center relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-orange before:to-transparent reveal"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,100,44,0.1), transparent), linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0.6) 100%), url(/cta-bg.jpg) center 60%/cover no-repeat",
          }}
        >
          <h2 className="font-display text-[1.6rem] font-bold mb-2.5 relative z-1">
            {t("cta.title")}
          </h2>
          <p className="text-text-secondary text-[0.95rem] max-w-130 mx-auto mb-8 leading-[1.65] relative z-1">
            {t("cta.desc")}
          </p>
          <div className="flex gap-3 justify-center flex-wrap relative z-1">
            <a
              href="https://nexbridge.io/en/otc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-linear-to-br min-w-60 from-orange to-orange-light text-white no-underline rounded-full font-semibold text-[0.95rem] transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,100,44,0.25)]"
            >
              {t("cta.ctaPrimary")}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-white/4 border min-w-60 border-white/6 text-text-primary no-underline rounded-full font-semibold text-[0.95rem] transition-all duration-300 hover:bg-white/8 hover:border-white/12"
            >
              {t("cta.ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
