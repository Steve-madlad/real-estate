export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://main.dj10cqjnl6way.amplifyapp.com';
export const SITE_NAME = 'Rentiful Real Estate';
export const DEFAULT_OG_IMAGE = '/Rentiful-OG-image.png';

export type SeoProperty = {
  id: number;
  name: string;
  description: string;
  photoUrls?: string[];
  location?: {
    city?: string | null;
    state?: string | null;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

function getPropertyApiUrl(id?: string): string | null {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) return null;

  try {
    return new URL(id ? `/property/${encodeURIComponent(id)}` : '/property', apiBaseUrl).toString();
  } catch {
    return null;
  }
}

async function fetchApiData<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return null;

    const result = (await response.json()) as ApiResponse<T>;
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function getSeoProperty(id: string): Promise<SeoProperty | null> {
  const url = getPropertyApiUrl(id);
  if (!url) return null;
  return fetchApiData<SeoProperty>(url);
}

export async function getPublicPropertyIds(): Promise<number[]> {
  const url = getPropertyApiUrl();
  if (!url) return [];

  const properties = await fetchApiData<Pick<SeoProperty, 'id'>[]>(url);
  return properties?.map(({ id }) => id).filter(Number.isInteger) ?? [];
}
