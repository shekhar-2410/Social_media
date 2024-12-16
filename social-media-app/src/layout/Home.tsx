import React, { useState, useEffect } from "react";
import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaCog,
  FaLifeRing,
} from "react-icons/fa"; 
import UserList from "../components/Users";
import { useNavigate } from "react-router-dom";
import userImg from "../assets/image.png";
import PostCard from "../components/Posts";
import PopularNewsFeed from "../components/PopularFeed";
import client from "../../apolloClient";
import { gql } from "@apollo/client";

interface Edge {
  node: {
    id: string;
    following_name: string;
    follower_name: string;
  };
}

const GET_FOLLOWING_USERS = gql`
  query {
    follow_relationshipsCollection {
      edges {
        node {
          id
          following_name
          follower_name
        }
      }
    }
  }
`;

const Home = () => {
  const [following, setFollowing] = useState<
    { id: string; following_name: string; follower_name: string }[]
  >([]);

  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    displayName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("userDetails");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchFollowingUsers = async () => {
    try {
      const { data } = await client.query({
        query: GET_FOLLOWING_USERS,
      });

      setFollowing(
        data.follow_relationshipsCollection.edges.map((edge: Edge) => edge.node)
      );
    } catch (error) {
      console.error("Error fetching following users:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFollowingUsers();
    }
  }, [user]);

  const signOut = () => {
    localStorage.removeItem("UserDetails");
    navigate("/");
  };

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 text-white min-h-screen p-6 flex flex-col">
        {/* User Details */}
        <div className="flex items-center space-x-4 mb-8">
          <img
            src={userImg}
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-2 border-gray-600"
          />
          <div>
            <p className="font-bold text-lg capitalize">
              {user?.displayName || "User"}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <p className="font-semibold mb-2">Following</p>
          <ul className="space-y-2 max-h-[320px] overflow-y-auto">
            {following.length === 0 ? (
              <p className="text-sm text-gray-500">
                You are not following anyone.
              </p>
            ) : (
              following
                .slice(0, showMore ? following.length : 5)
                .map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg"
                        title={user.following_name}
                      >
                        {user.following_name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm text-gray-700">
                        {user.following_name}
                      </p>
                    </div>
                  </li>
                ))
            )}
          </ul>
          {following.length > 5 && (
            <button
              onClick={() => setShowMore((prev) => !prev)}
              className="mt-2 text-blue-500"
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        {/* Nav Items */}
        <div className="mt-4">
          <ul>
            <li className="flex items-center text-gray-400 hover:text-white cursor-pointer mb-2">
              <FaTachometerAlt className="mr-2" />
              Dashboard
            </li>
            <li className="flex items-center text-gray-400 hover:text-white cursor-pointer mb-2">
              <FaCog className="mr-2" />
              Settings
            </li>
            <li className="flex items-center text-gray-400 hover:text-white cursor-pointer">
              <FaLifeRing className="mr-2" />
              Help
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <button
          onClick={signOut}
          className="mt-auto text-red-500 flex items-center"
        >
          <FaSignOutAlt className="mr-2" /> Log Out
        </button>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PostCard />
            <PopularNewsFeed />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>{/* <NewsFeed /> */}</div>
            <UserList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
