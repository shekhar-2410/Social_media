import React from "react";

const SuggestedPeople = ({ users, onFollowToggle }: { users: any[]; onFollowToggle: (id: string) => void }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-bold text-lg mb-4">Suggested People to Follow</h2>
      <ul className="space-y-3">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center border-b pb-3">
            <p className="font-semibold">{user.name}</p>
            <button
              onClick={() => onFollowToggle(user.id)}
              className="bg-blue-500 text-white px-4 py-1 rounded-md"
            >
              Follow
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedPeople;
