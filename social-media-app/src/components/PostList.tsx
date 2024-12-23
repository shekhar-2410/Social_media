import React from "react";
interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  post_image: string | null;
  created_at: string;
  user_name?: string;
}
const PostListItem = React.memo(({ post }: { post: Post }) => {
  return (
    <li key={post.id} className="border-b pb-3">
      <h3 className="font-semibold text-xl">{post.title}</h3>
      <p className="text-sm">{post.content}</p>
      <p className="text-xs text-gray-400">
        Posted on: {new Date(post.created_at).toLocaleDateString()}
      </p>
      {post.user_name && (
        <p className="text-xs text-gray-500">By: {post.user_name}</p>
      )}
      {post.post_image && (
        <img
          src={post.post_image}
          alt="Post"
          className="mt-2 w-24 rounded-lg"
        />
      )}
    </li>
  );
});

export default PostListItem;
