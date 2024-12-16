import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FiImage } from "react-icons/fi";
import NewsFeed from "./NewsFeed";

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

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts"); // Your API endpoint
        setPosts(response.data); // Assuming the response is an array of posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Handle form submission
  const handlePostSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!postContent && !image) return;

    const newPost = {
      content: postContent,
      image,
      timestamp: new Date().toLocaleString(),
    };

    try {
      // Send the post data to your API
      const response = await axios.post("/api/posts", newPost);
      // After the post is created, fetch the updated list of posts
      setPosts([response.data, ...posts]); // Add the new post to the state
      setPostContent(""); // Clear the input fields
      setImage(null);
    } catch (error) {
      console.error("Error posting:", error);
    }
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
    <div className="max-w-2XL">
      <div className="p-8 bg-card-color shadow-md">
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full p-2 border-none bg-card-color focus:outline-none focus:ring-0"
            rows={4}
          />
          <div className="flex justify-between items-center">
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
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </form>
      </div>
        <NewsFeed/>
    </div>
  );
};

export default PostCard;
