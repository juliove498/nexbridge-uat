import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import HeroSection from "@/components/home/HeroSection";
import PartnersMarquee from "@/components/home/PartnersMarquee";
import ProductsSection from "@/components/home/ProductsSection";
import PlatformsSection from "@/components/home/PlatformsSection";
import InfrastructureSection from "@/components/home/InfrastructureSection";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: "https://nexbridge.finance/",
      type: "website",
      images: ["https://nexbridge.finance/nexbridge-og.png"],
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: "https://nexbridge.finance/",
    },
  };
}

export default function HomePage() {
  const t = useTranslations("HomePage");
  const translate = (k: string) => t(k as never);
  const translateRich = (k: string, v: Record<string, unknown>): ReactNode =>
    (t.rich as (key: string, values: Record<string, unknown>) => ReactNode)(
      k,
      v,
    );
  const translateRaw = (k: string) => t.raw(k as never);

  return (
    <>
      <ScrollReveal />
      <HeroSection />
      <PartnersMarquee t={translate} tRich={translateRich} />
      <ProductsSection t={translate} tRich={translateRich} />
      <PlatformsSection t={translate} tRich={translateRich} />
      <InfrastructureSection
        t={translate}
        tRich={translateRich}
        tRaw={translateRaw}
      />
      <FeaturesGrid t={translate} tRich={translateRich} />
      <HowItWorks t={translate} tRich={translateRich} />
      <CTASection t={translate} tRich={translateRich} />
    </>
  );
}
