export interface UnsplashImage {
  url: string;
  thumb: string;
  alt: string;
  credit?: { name: string; link: string };
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

export async function fetchUnsplashImages(query: string, count: number = 6): Promise<UnsplashImage[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        next: { revalidate: 2592000 }, // 30 days
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((photo: Record<string, unknown>) => {
      const user = photo.user as Record<string, unknown>;
      const links = user?.links as Record<string, string>;
      const urls = photo.urls as Record<string, string>;
      return {
        url: urls.regular,
        thumb: urls.small,
        alt: (photo.alt_description as string) || query,
        credit: {
          name: user?.name as string,
          link: `${links?.html}?utm_source=jaivik_overseas_consultants&utm_medium=referral`,
        },
      };
    });
  } catch {
    return [];
  }
}

// Country-specific search queries for relevant landmark/campus shots
export const COUNTRY_QUERIES: Record<string, string> = {
  USA: 'Harvard MIT campus Boston Massachusetts aerial',
  UK: 'Oxford University Bodleian Library England',
  Canada: 'University of Toronto campus Ontario Canada',
  Australia: 'University of Sydney Opera House harbour aerial',
  Germany: 'Heidelberg University castle Germany campus',
  Ireland: 'Trinity College Dublin Ireland campus library',
  Singapore: 'National University Singapore NUS campus aerial',
  'New Zealand': 'University of Auckland city campus New Zealand',
  France: 'Sorbonne Paris Eiffel Tower university France',
  Netherlands: 'Leiden University Amsterdam canal Netherlands',
  Sweden: 'Stockholm University campus Sweden autumn',
  UAE: 'Dubai skyline university campus aerial UAE',
  Denmark: 'Copenhagen University Denmark campus',
  Italy: 'Bologna University Rome Colosseum Italy',
  Spain: 'Madrid Complutense University Spain campus',
};
