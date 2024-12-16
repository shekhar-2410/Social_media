import React from "react";

const NewsFeed = () => {
  const posts = [
    { id: 1, author: "John Doe", content: "This is my first post!" },
    { id: 2, author: "Emily Carter", content: "Loving this platform!" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-bold text-lg mb-4">All Posts</h2>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="border-b pb-3">
            <p className="font-semibold">{post.author}</p>
            <p className="text-sm text-gray-600">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsFeed;
