import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import client from "../../apolloClient";

const GET_USERS = gql`
  query {
    usersCollection {
      edges {
        node {
          id
          name
          email
          profile_pic
        }
      }
    }
  }
`;

interface User {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
}

const UserList: React.FC = () => {
  // State to store users data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const { data } = await client.query({
        query: GET_USERS,
      });
      // Update state with fetched users from the nested `edges.node` structure
      setUsers(data.usersCollection.edges.map((edge: any) => edge.node));
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  // Trigger data fetch when component mounts
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array to run only once on mount

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {users.map((user: User) => (
        <li key={user.id}>
          <img src={user.profile_pic} alt={user.name} />
          <p>{user.name}</p>
          <p>{user.email}</p>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
