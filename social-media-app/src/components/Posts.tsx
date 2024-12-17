import React, { useState, ChangeEvent, FormEvent } from "react";
import { gql, useMutation } from "@apollo/client";
import { FiImage } from "react-icons/fi";
import NewsFeed from "./NewsFeed";

// GraphQL Mutation for inserting a new post
const INSERT_POST = gql`
  mutation InsertPost(
    $user_id: UUID!
    $title: String!
    $content: String!
    $post_image: String
  ) {
    insertIntonewspostsCollection(
      objects: {
        user_id: $user_id
        title: $title
        content: $content
        post_image: $post_image
      }
    ) {
      records {
        id
        title
        content
        post_image
        created_at
      }
    }
  }
`;

const PostCard: React.FC = () => {
  const [postContent, setPostContent] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState<string>("");

  // Retrieve user_id from localStorage
  const userId = JSON.parse(localStorage.getItem("userUUID") || "{}");

  if (!userId) {
    console.error("User ID not found in localStorage!");
    return <div>Error: User not logged in.</div>;
  }

  // Use Apollo Client's useMutation hook
  const [insertPost] = useMutation(INSERT_POST);

  // Handle form submission
  const handlePostSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postContent && !image && !postTitle) return;

    const variables = {
      user_id: userId,
      title: postTitle,
      content: postContent,
      post_image: image,
    };

    try {
      const { data } = await insertPost({ variables });
      console.log("Post inserted successfully:", data);

      // Clear input fields after successful post
      setPostTitle("");
      setPostContent("");
      setImage(null);
    } catch (error) {
      console.error("Error inserting post:", error);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
        <form onSubmit={handlePostSubmit}>
          <input
            type="text"
            placeholder="Enter post title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-full  border-none bg-card-color focus:outline-none focus:ring-0"
          />
          <textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full py-1 border-none bg-card-color focus:outline-none focus:ring-0"
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
      <NewsFeed />
    </div>
  );
};

export default PostCard;
