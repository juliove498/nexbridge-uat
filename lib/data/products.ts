export interface Product {
  key: string
  img: string
  alt: string
  yield: string
  live: boolean
}

export const PRODUCTS: Product[] = [
  { key: 'USTBL',  img: '/issuance-logos/ustbl.svg',                        alt: 'USTBL',        yield: '4.3% ATM Yield', live: true  },
  { key: 'nMSTR',  img: '/issuance-logos/microstrategy.1530cc8d.svg',       alt: 'MicroStrategy', yield: '—', live: false },
  { key: 'nTSLA',  img: '/issuance-logos/tesla.043c73d1.svg',               alt: 'Tesla',         yield: '—', live: false },
  { key: 'nSPY',   img: '/issuance-logos/invesco.cb5db553.svg',             alt: 'SPDR S&P 500',  yield: '—', live: false },
  { key: 'nNVDA',  img: '/issuance-logos/nvidia.df7eed26.svg',              alt: 'NVIDIA',        yield: '—', live: false },
  { key: 'USYLD',  img: '/issuance-logos/usyld.svg',                       alt: 'USYLD',         yield: '—', live: false },
  { key: 'USGRW',  img: '/issuance-logos/berkshire-hathaway.1b72b181.svg',  alt: 'BlackRock',     yield: '—', live: false },
  { key: 'nNSDQ',  img: '/issuance-logos/invesco.cb5db553.svg',             alt: 'Invesco QQQ',   yield: '—', live: false },
]
