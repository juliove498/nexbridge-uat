import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import ScrollReveal from '@/components/ScrollReveal'
import ExploreClient from '@/components/ExploreClient'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ExplorePage' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: 'https://nexbridge.finance/explore',
      type: 'website',
      images: ['https://nexbridge.finance/nexbridge-og.png'],
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: 'https://nexbridge.finance/explore',
    },
  }
}

export default function ExplorePage() {
  return (
    <main>
      <ScrollReveal />
      <ExploreClient />
    </main>
  )
}
