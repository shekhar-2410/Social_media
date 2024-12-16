import React, { useState } from "react";

const PopularNewsFeed = () => {
  const newsFeed = [
    {
      id: 1,
      title: "React 18 Released",
      description: "Discover the latest features in React 18.",
      image:
        "https://p16-va.lemon8cdn.com/tos-maliva-v-ac5634-us/5d42fff50a5c4256a61c78c20477c20f~tplv-tej9nj120t-origin.webp",
    },
    {
      id: 2,
      title: "Tailwind 3.0 is Here",
      description: "Tailwind CSS introduces JIT engine.",
      image:
        "https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg=",
    },
    {
      id: 3,
      title: "Next.js 13 Features",
      description: "Explore the new app directory and features in Next.js 13.",
      image:
        "https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY=",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  

  const nextCard = () => {
    if (currentIndex < newsFeed.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="bg-white p-4 shadow-md">
      <h2 className="font-bold text-lg mb-2">Popular News Feed</h2>
      <div className="relative overflow-hidden">
        <div
          className="slider-container flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: currentIndex === newsFeed.length - 1 ? "none" : "transform 0.5s", 
          }}
        >
          {newsFeed.map((item) => (
            <div
              key={item.id}
              className="bg-card-color shadow-md overflow-hidden flex flex-col w-full"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-600 text-white px-4 py-2 rounded-full focus:outline-none"
          onClick={prevCard}
          disabled={currentIndex === 0} 
        >
          &lt;
        </button>
        <button
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-600 text-white px-4 py-2 rounded-full focus:outline-none"
          onClick={nextCard}
          disabled={currentIndex === 0}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PopularNewsFeed;
