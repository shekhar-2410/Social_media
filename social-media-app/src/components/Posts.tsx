import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import client from "../../apolloClient";
import { useFollowedUsers } from "../context/FollowedUsersContext.tsx";
import { createClient } from "@supabase/supabase-js";
import PostListItem from "./PostList.tsx";
const SUPABASE_URL = "https://hwuczpdrsyqfddhqegjl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dWN6cGRyc3lxZmRkaHFlZ2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNzE0MTgsImV4cCI6MjA0OTY0NzQxOH0.dFvyWUBuxPpAUm3LOtc1f8B3t0feIgcgJPIW3DR0BpI";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  post_image: string | null;
  created_at: string;
  user_name?: string;
}
const GET_USER_POSTS = gql`
  query GetUserPosts {
    newspostsCollection {
      edges {
        node {
          id
          user_id
          title
          content
          post_image
          created_at
        }
      }
    }
  }
`;

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

const GET_USER_NAME = gql`
  query GetUserName($id: String!) {
    usersCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          name
        }
      }
    }
  }
`;

const PostCard: React.FC = () => {
  const { followedUsers } = useFollowedUsers();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [postContent, setPostContent] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const userId = JSON.parse(localStorage.getItem("userUUID") || "{}");

  const [insertPost] = useMutation(INSERT_POST, {
    refetchQueries: [{ query: GET_USER_POSTS }],
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0]; // Only handle one file for simplicity
      const fileName = `uploads/${Date.now()}-${file.name}`;

      // Show the file name immediately to the user
      setUploadedFileName(file.name);

      supabase.storage
        .from("post-image")
        .upload(fileName, file)
        .then(({ data, error }) => {
          if (error) {
            console.error("Error uploading file:", error.message);
            toast.error("Failed to upload image. Please try again.");
            setUploadedFileName(null); // Reset the file name if upload fails
            return;
          }

          const publicUrl = getPublicUrl(data?.path || "");

          if (publicUrl) {
            setImage(publicUrl); // Set the image URL for the post
            toast.success("Image uploaded successfully.");
          }
        });
    }
  };

  const getPublicUrl = (filePath: string) => {
    return `${
      supabase.storage.from("post-image").getPublicUrl(filePath).data.publicUrl
    }`;
  };

  const handlePostSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postContent || !postTitle) {
      toast.error("Title and content are required!");
      return;
    }

    const variables = {
      user_id: userId,
      title: postTitle,
      content: postContent,
      post_image: image || "",
    };

    try {
      const { data } = await insertPost({ variables });
      console.log(data);
      toast.success("Post inserted successfully");
      setPostTitle("");
      setPostContent("");
      setImage(null);
    } catch (error) {
      console.error("Error inserting post:", error);
      toast.error("Failed to insert post. Please try again.");
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await client.query({
        query: GET_USER_POSTS,
      });

      const newPosts = data.newspostsCollection.edges.map(
        (edge: { node: Post }) => edge.node
      );

      const loggedInUserId = userId;

      let filteredPosts: Post[] = [];
      if (followedUsers.size === 0) {
        filteredPosts = newPosts.filter(
          (post: { user_id: string }) => post.user_id === loggedInUserId
        );
      } else {
        filteredPosts = newPosts.filter(
          (post: { user_id: string }) =>
            post.user_id === loggedInUserId || followedUsers.has(post.user_id)
        );
      }

      const missingUserIds = Array.from(
        new Set(
          filteredPosts
            .map((post) => post.user_id)
            .filter((id) => !userNames[id])
        )
      );

      const userNamePromises = missingUserIds.map((id) =>
        client.query({
          query: GET_USER_NAME,
          variables: { id },
        })
      );

      const userNameResults = await Promise.all(userNamePromises);

      const newUserNames: { [key: string]: string } = userNameResults.reduce(
        (acc, result, index) => {
          const userId = missingUserIds[index] as string;
          const name =
            result.data.usersCollection.edges[0]?.node.name || "Unknown User";
          return { ...acc, [userId]: name };
        },
        {}
      );

      setUserNames((prev) => ({ ...prev, ...newUserNames }));

      const postsWithNames = filteredPosts.map((post) => ({
        ...post,
        user_name: newUserNames[post.user_id] || userNames[post.user_id],
      }));

      const sortedPosts = postsWithNames.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      setPosts(sortedPosts);
      setHasMorePosts(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    const subscription = supabase
      .channel("public:newsposts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "newsposts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPosts((prevPosts) => [payload.new as Post, ...prevPosts]);
          } else if (payload.eventType === "UPDATE") {
            setPosts((prevPosts) =>
              prevPosts.map((post) =>
                post.id === (payload.new as Post).id
                  ? (payload.new as Post)
                  : post
              )
            );
          } else if (payload.eventType === "DELETE") {
            setPosts((prevPosts) =>
              prevPosts.filter((post) => post.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [followedUsers]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* commenting posts */}
      <div className="p-8 bg-card-color shadow-md">
        <form onSubmit={handlePostSubmit}>
          <input
            type="text"
            placeholder="Enter post title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-full border-none bg-card-color focus:outline-none focus:ring-0"
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
              className="text-blue-500 cursor-pointer hover:text-blue-600 flex items-center gap-2"
            >
              <FiImage className="w-6 h-6" />
              <span>Upload Image</span>
              <input
                type="file"
                id="image-upload"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </label>
            {uploadedFileName && (
              <span className="text-gray-600 text-sm">{uploadedFileName}</span>
            )}

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </form>
      </div>
      {/* All follows posts */}
      <div className="bg-white p-4 shadow-md ">
        <h2 className="font-bold text-lg mb-4">All Posts</h2>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMorePosts}
          loader={
            <div className="text-center text-gray-500">
              Loading more posts...
            </div>
          }
          scrollThreshold={0.95}
          scrollableTarget="scrollable-feed"
        >
          <ul
            className="space-y-3"
            id="scrollable-feed"
            style={{ height: "265px", overflowY: "auto" }}
          >
            {posts.map((post) => (
              <PostListItem key={post.id} post={post} />
            ))}
          </ul>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PostCard;
