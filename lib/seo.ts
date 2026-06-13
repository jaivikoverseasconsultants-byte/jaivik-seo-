import type { Metadata } from 'next';

const SITE_URL = 'https://study.jaivikoverseasconsultants.com';
const SITE_NAME = 'Jaivik Overseas Consultants';
const DEFAULT_OG = `${SITE_URL}/og-default.jpg`;

export function buildMetadata({
  title,
  description,
  path: pagePath = '/',
  ogImage = DEFAULT_OG,
  keywords = [],
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${pagePath}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      'study abroad from India',
      'overseas education consultants India',
      'Jaivik Overseas Consultants',
      ...keywords,
    ],
    authors: [{ name: SITE_NAME }],
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export const SITE_URL_EXPORT = SITE_URL;
