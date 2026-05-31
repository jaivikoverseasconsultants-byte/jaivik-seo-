export interface UnsplashImage {
  url: string;
  thumb: string;
  alt: string;
  credit: { name: string; link: string };
}

export async function fetchUnsplashImage(query: string): Promise<UnsplashImage | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        next: { revalidate: 2592000 }, // 30 days
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data.results?.[0];
    if (!photo) return null;
    return {
      url: photo.urls.regular,
      thumb: photo.urls.small,
      alt: photo.alt_description || query,
      credit: {
        name: photo.user.name,
        link: `${photo.user.links.html}?utm_source=jaivik_overseas_consultants&utm_medium=referral`,
      },
    };
  } catch {
    return null;
  }
}

// Country-specific search queries for relevant landscape/campus shots
export const COUNTRY_QUERIES: Record<string, string> = {
  USA: 'American university campus autumn',
  UK: 'Oxford Cambridge university campus UK',
  Canada: 'Canadian university campus Toronto',
  Australia: 'Australian university campus Sydney',
  Germany: 'German university campus Berlin',
  Ireland: 'Dublin university campus Ireland',
  Singapore: 'National University Singapore campus',
  'New Zealand': 'New Zealand university campus',
  France: 'Paris Sorbonne university campus France',
  Netherlands: 'Amsterdam university campus Netherlands',
  Sweden: 'Stockholm university campus Sweden',
  UAE: 'Dubai university campus UAE',
  Denmark: 'Copenhagen university campus Denmark',
  Italy: 'Rome Bologna university campus Italy',
  Spain: 'Madrid Barcelona university campus Spain',
};
