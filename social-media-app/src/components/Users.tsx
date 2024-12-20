import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import client from "../../apolloClient";
import { useFollowedUsers } from "../context/FollowedUsersContext";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Edge {
  node: {
    following_id: string;
  };
}

// GraphQL Queries and Mutations...
const GET_USERS = gql`
  query {
    usersCollection {
      edges {
        node {
          id
          name
          email
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

const FOLLOW_USER = gql`
  mutation FollowUser($followerEmail: String!, $followingId: UUID!) {
    insertIntofollowsCollection(
      objects: { follower_email: $followerEmail, following_id: $followingId }
    ) {
      records {
        follower_email
        following_id
      }
    }
  }
`;

const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followerEmail: String!, $followingId: UUID!) {
    deleteFromfollowsCollection(
      filter: {
        follower_email: { eq: $followerEmail }
        following_id: { eq: $followingId }
      }
    ) {
      affectedCount
    }
  }
`;

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [buttonLoading, setButtonLoading] = useState<Set<string>>(new Set());
  const { followedUsers, setFollowedUsers } = useFollowedUsers(); // Use context
  const [loggedInEmail, setLoggedInEmail] = useState<string>("");

  const fetchData = async () => {
    try {
      const userDetails = JSON.parse(
        localStorage.getItem("userDetails") || "{}"
      );
      const email = userDetails.email || "";

      if (!email) {
        throw new Error("User email not found in local storage.");
      }

      setLoggedInEmail(email);

      // Fetch all users
      const usersResponse = await client.query({ query: GET_USERS });

      const allUsers: User[] = usersResponse.data.usersCollection.edges.map(
        (edge: { node: User }) => edge.node
      );

      const loggedInUser = allUsers.find((user) => user.email === email);

      if (loggedInUser) {
        localStorage.setItem("userUUID", JSON.stringify(loggedInUser.id));
      }

      // Fetch followed users
      const followsResponse = await client.query({
        query: GET_FOLLOWING_IDS,
        variables: { email },
      });

      // Extract following IDs
      const userFollowingIds: Set<string> = new Set(
        followsResponse.data.followsCollection.edges.map(
          (edge: Edge) => edge.node.following_id
        )
      );

      // Update both context and local state
      setFollowedUsers(userFollowingIds);

      // Filter out the logged-in user from the users list
      setUsers(allUsers.filter((user) => user.email !== email));
      setLoading(false);
    } catch (err) {
      setError("Error fetching data: " + String(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isFollowing = (userId: string) => followedUsers.has(userId);

  const handleFollowAction = async (
    action: "follow" | "unfollow",
    userId: string
  ) => {
    try {
      setButtonLoading((prev) => new Set(prev.add(userId)));

      if (action === "follow") {
        await client.mutate({
          mutation: FOLLOW_USER,
          variables: { followerEmail: loggedInEmail, followingId: userId },
        });
        setFollowedUsers((prev) => new Set(prev.add(userId)));
      } else {
        await client.mutate({
          mutation: UNFOLLOW_USER,
          variables: { followerEmail: loggedInEmail, followingId: userId },
        });
        setFollowedUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(userId);
          return updated;
        });
      }
    } catch (err) {
      console.error("Error processing follow/unfollow action:", err);
    } finally {
      setButtonLoading((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white p-4 shadow-md">
      <h2 className="font-bold text-lg mb-4">Users You Can Follow</h2>
      <div className="relative overflow-x-auto">
        <div className="flex flex-nowrap gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-card-color shadow-md overflow-hidden flex flex-col w-1/4 h-40 rounded-md"
            >
              <div className="p-2 flex-grow">
                <div className="user-avatar flex items-center justify-center mb-2">
                  <span className="text-white bg-gray-600 rounded-full h-8 w-8 flex items-center justify-center text-sm">
                    {user.name[0]}
                  </span>
                </div>
                <h5
                  style={{ fontSize: "14px" }}
                  className="font-semibold text-base text-center"
                >
                  {user.name}
                </h5>
              </div>
              <div className="p-2 flex items-center justify-center">
                <button
                  disabled={buttonLoading.has(user.id)}
                  onClick={() =>
                    handleFollowAction(
                      isFollowing(user.id) ? "unfollow" : "follow",
                      user.id
                    )
                  }
                  className={`w-24 py-2 px-6 rounded-full text-white font-semibold text-sm transition-colors duration-300 ${
                    isFollowing(user.id)
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {buttonLoading.has(user.id)
                    ? "Processing..."
                    : isFollowing(user.id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
