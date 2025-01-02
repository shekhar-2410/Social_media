import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}
const PopularNewsFeed = () => {
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=6a5cb52750f24102be352f817c03eb44`
      );
      setNewsFeed(response.data.articles);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const cardsPerSlide = 3; // Number of cards per slide
  const totalSlides = Math.ceil(newsFeed.length / cardsPerSlide);

  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 shadow-md w-full max-w-4xl mx-auto">
        <h2 className="font-bold text-lg mb-4">Popular News Feed</h2>
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (newsFeed.length === 0) {
    return (
      <div className="bg-white p-4 shadow-md w-full max-w-4xl mx-auto">
        <h2 className="font-bold text-lg mb-4">Popular News Feed</h2>
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500">No news available.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 shadow-md w-full mx-auto h-80">
      <h2 className="font-bold text-lg mb-4">Popular News Feed</h2>
      <div className="relative overflow-hidden">
        {/* Slider Container */}
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${totalSlides * 100}%`,
          }}
        >
          {/* Group cards into slides */}
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="flex flex-wrap"
              style={{ flex: "0 0 100%" }} // Each slide takes full width
            >
              {newsFeed
                .slice(
                  slideIndex * cardsPerSlide,
                  slideIndex * cardsPerSlide + cardsPerSlide
                )
                .map((item, index) => (
                  <div key={index} className="card-container shadow-md">
                    <div className="card-image">
                      {item.urlToImage && (
                        <img src={item.urlToImage} alt={item.title} />
                      )}
                    </div>
                    <div className="card-title">
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                    </div>
                    {/* Hover effect reveals the content */}
                    <div className="card-content">
                      <div className="p-4">
                        <p className="text-xs text-gray-600">
                          {item.description}
                        </p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-xs"
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white px-3 py-2 rounded-full"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          disabled={currentIndex === totalSlides - 1}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white px-3 py-2 rounded-full"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PopularNewsFeed;
