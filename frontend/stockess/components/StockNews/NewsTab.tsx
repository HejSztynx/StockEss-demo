"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchCompanyNews, NewsItem } from "./NewsService";
import Image from "next/image";

interface NewsTabProps {
  companyName: string;
}

export default function NewsTab({ companyName }: NewsTabProps) {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshNews = async () => {
    setLoading(true);
    const data = await fetchCompanyNews(companyName);
    setNewsList(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshNews();
  }, [companyName]);

  if (loading) {
    return <p className="text-center text-gray-500">Ładowanie wiadomości...</p>;
  }

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4 text-center">
        News — {companyName}
      </h1>

      {newsList.length === 0 ? (
        <p className="text-gray-500 italic">Brak wiadomości dla tej spółki.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {newsList.map((news) => (
            <Card
              key={news.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedNews(news)}
            >
              <CardContent className="p-4 flex flex-col justify-between h-56">
                <h2 className="text-lg font-semibold line-clamp-2">{news.title}</h2>
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {news.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(news.publishedAt).toLocaleDateString("pl-PL")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedNews && (
        <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedNews.title}</DialogTitle>
            </DialogHeader>

            {selectedNews.image && (
              <div className="relative w-full h-64 mb-4">
                <img
                  src={selectedNews.image}
                  alt="news"
                //   fill
                  className="object-cover rounded-md"
                />
              </div>
            )}

            <p className="text-sm text-gray-700 mb-4 text-justify whitespace-pre-line">
              {selectedNews.content}
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-500">
              <span>
                Source:{" "}
                <span className="font-medium">{selectedNews.source.name}</span>
              </span>
              <a
                href={selectedNews.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Read the full article
              </a>
              <Button variant="outline" onClick={() => setSelectedNews(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
