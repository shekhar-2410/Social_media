import React, { useState, ChangeEvent, FormEvent } from "react";
import { FiImage } from "react-icons/fi"; // Image icon

// Define Post type
interface Post {
  id: number;
  content: string;
  image: string | null;
  timestamp: string;
}

const PostCard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  const handlePostSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!postContent && !image) return;

    const newPost: Post = {
      id: posts.length + 1,
      content: postContent,
      image,
      timestamp: new Date().toLocaleString(),
    };

    setPosts([newPost, ...posts]);
    setPostContent("");
    setImage(null);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="p-8 bg-card-color shadow-md ">
        <form onSubmit={handlePostSubmit} className="relative">
          <textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full p-2 border-none bg-card-color focus:outline-none focus:ring-0"
            rows={4}
          />
          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
            <label
              htmlFor="image-upload"
              className="text-blue-500 cursor-pointer hover:text-blue-600"
            >
              <FiImage className="w-6 h-6" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <button
            type="submit"
            className="absolute bottom-3 right-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Post
          </button>
        </form>
      </div>

      {/* News Feed */}
      <div className="mt-0 space-y-4">
        {posts.length === 0 && (
          <p className="text-center text-gray-500">
            No posts yet. Start posting!
          </p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="p-4 bg-white shadow-md ">
            <p className="text-sm text-gray-500">{post.timestamp}</p>
            <p className="mt-2">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="mt-2 w-full rounded-md object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
