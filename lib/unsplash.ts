export interface UnsplashImage {
  url: string;
  thumb: string;
  alt: string;
  credit?: { name: string; link: string };
}

const FALLBACK_IMAGES: Record<string, { url: string; thumb: string }> = {
  'Harvard MIT campus Boston Massachusetts aerial': {
    url: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=400&q=80',
  },
  'Oxford University Bodleian Library England': {
    url: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=400&q=80',
  },
  'University of Toronto campus Ontario Canada': {
    url: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=400&q=80',
  },
  'University of Sydney Opera House harbour aerial': {
    url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80',
  },
  'Heidelberg University castle Germany campus': {
    url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80',
  },
  'Trinity College Dublin Ireland campus library': {
    url: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=400&q=80',
  },
  'National University Singapore NUS campus aerial': {
    url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80',
  },
  'University of Auckland city campus New Zealand': {
    url: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&q=80',
  },
  'Sorbonne Paris Eiffel Tower university France': {
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
  },
  'Leiden University Amsterdam canal Netherlands': {
    url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80',
  },
  'Stockholm University campus Sweden autumn': {
    url: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400&q=80',
  },
  'Dubai skyline university campus aerial UAE': {
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
  },
  'Copenhagen University Denmark campus': {
    url: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&q=80',
  },
  'Bologna University Rome Colosseum Italy': {
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80',
  },
  'Madrid Complutense University Spain campus': {
    url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1080&q=80',
    thumb: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80',
  },
};

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
    if (!res.ok) {
      const fallback = FALLBACK_IMAGES[query];
      if (fallback) return { url: fallback.url, thumb: fallback.thumb, alt: query, credit: undefined };
      return null;
    }
    const data = await res.json();
    const photo = data.results?.[0];
    if (!photo) {
      const fallback = FALLBACK_IMAGES[query];
      if (fallback) return { url: fallback.url, thumb: fallback.thumb, alt: query, credit: undefined };
      return null;
    }
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
    const fallback = FALLBACK_IMAGES[query];
    if (fallback) return { url: fallback.url, thumb: fallback.thumb, alt: query, credit: undefined };
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
