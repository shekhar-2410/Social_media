import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { gql } from "@apollo/client";
import client from "../../apolloClient";

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  post_image: string;
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

const GET_FOLLOWING_IDS = gql`
  query GetFollowingIds($email: String!) {
    followsCollection(filter: { follower_email: { eq: $email } }) {
      edges {
        node {
          following_id
        }
      }
    }
  }
`;

const NewsFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  interface Edge {
    node: {
      following_id: string;
    };
  }

  // Fetch followed users based on the current user's email
  const fetchFollowedUsers = async () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
    const currentUserEmail = userDetails?.email;

    try {
      const followsResponse = await client.query({
        query: GET_FOLLOWING_IDS,
        variables: { email: currentUserEmail },
      });
      const followedUserIds = followsResponse.data.followsCollection.edges.map(
        (edge: Edge) => edge.node.following_id
      );
      setFollowedUsers(new Set(followedUserIds));
    } catch (err) {
      console.log("Error fetching followed users:", err);
    }
  };

  // Fetch posts for followed users
  const fetchPosts = async () => {
    try {
      const { data } = await client.query({
        query: GET_USER_POSTS,
      });

      const newPosts = data.newspostsCollection.edges.map(
        (edge: { node: Post }) => edge.node
      );

      // Filter posts by followed users
      const filteredPosts = newPosts.filter((post) =>
        followedUsers.has(post.user_id)
      );

      // Fetch missing user names
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

      // Update user names
      const newUserNames = userNameResults.reduce((acc, result, index) => {
        const userId = missingUserIds[index];
        const name =
          result.data.usersCollection.edges[0]?.node.name || "Unknown User";
        return { ...acc, [userId]: name };
      }, {});

      setUserNames((prev) => ({ ...prev, ...newUserNames }));

      // Attach user names to posts
      const postsWithNames = filteredPosts.map((post) => ({
        ...post,
        user_name: newUserNames[post.user_id] || userNames[post.user_id],
      }));

      setPosts(postsWithNames);
      setHasMorePosts(false); // No pagination; load all posts once
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchFollowedUsers();
  }, []);

  useEffect(() => {
    if (followedUsers.size > 0) {
      fetchPosts();
    }
  }, [followedUsers]);

  return (
    <div className="bg-white p-4 shadow-md">
      <h2 className="font-bold text-lg mb-4">All Posts</h2>

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMorePosts}
        loader={
          <div className="text-center text-gray-500">Loading more posts...</div>
        }
        endMessage={
          <div className="text-center text-gray-500">
            No more posts available
          </div>
        }
        scrollThreshold={0.95}
        scrollableTarget="scrollable-feed"
      >
        <ul
          className="space-y-3"
          id="scrollable-feed"
          style={{ height: "245px", overflowY: "auto" }}
        >
          {posts.map((post) => (
            <li key={post.id} className="border-b pb-3">
              <p className="font-medium text-gray-800">{post.title}</p>
              <p className="text-sm text-gray-600">{post.content}</p>
              <p className="text-xs text-gray-500">
                By: {post.user_name || "Unknown User"}
              </p>
              <p className="text-xs text-gray-400">
                Posted on: {new Date(post.created_at).toLocaleDateString()}
              </p>
              {post.post_image && (
                <img
                  src={post.post_image}
                  alt="Post"
                  className="mt-2 w-full h-auto rounded-lg"
                />
              )}
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default NewsFeed;
