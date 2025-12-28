export interface NewsSource {
  id: string;
  name: string;
  url: string;
  country?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  lang: string;
  source: NewsSource;
}

export async function fetchCompanyNews(companyName: string): Promise<NewsItem[]> {
  try {
    const encodedCompany = encodeURIComponent(companyName.trim());
    const apiUrl = `http://localhost:5000/news?company=${encodedCompany}`;

    const response = await fetch(apiUrl);
    console.log("Response object:", response);

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? (data as NewsItem[]) : [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}