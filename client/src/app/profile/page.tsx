"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { User } from "@/lib/types";

function Profile({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      // Call the API to update the user information
      const response = await fetch(`/api/users/?id=${editedUser.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      const updatedUser = await response.json();
      console.log("User updated successfully:", updatedUser);

      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border border-rose-200 rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{editedUser.name}</h1>
        <Button onClick={handleEdit}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>
      <div className="space-y-4">
        {/* TODO: turn this into a .map() */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-rose-700">Username:</label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={editedUser.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-rose-500 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          ) : (
            <p className="text-gray-900">{editedUser.username}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-rose-700">Pronouns:</label>
          {isEditing ? (
            <input
              type="text"
              name="pronouns"
              value={editedUser.pronouns}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-rose-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          ) : (
            <p className="text-gray-900">{editedUser.pronouns}</p>
          )}
        </div>
        {editedUser.genderIdentity && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Gender Identity:</label>
            {isEditing ? (
              <input
                type="text"
                name="genderIdentity"
                value={editedUser.genderIdentity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-rose-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{editedUser.genderIdentity}</p>
            )}
          </div>
        )}
        {editedUser.sexuality && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sexuality:</label>
            {isEditing ? (
              <input
                type="text"
                name="sexuality"
                value={editedUser.sexuality}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-rose-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{editedUser.sexuality}</p>
            )}
          </div>
        )}
        {editedUser.bio && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-rose-700">Bio:</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={editedUser.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            ) : (
              <p className="text-gray-900">{editedUser.bio}</p>
            )}
          </div>
        )}
        {editedUser.hobbies && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-rose-700">Hobbies:</label>
            {isEditing ? (
              <input
                type="text"
                name="hobbies"
                value={editedUser.hobbies}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{editedUser.hobbies}</p>
            )}
          </div>
        )}
        {editedUser.major && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-rose-700">Major:</label>
            {isEditing ? (
              <input
                type="text"
                name="major"
                value={editedUser.major}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{editedUser.major}</p>
            )}
          </div>
        )}
        {editedUser.age && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-rose-700">Age:</label>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={editedUser.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{editedUser.age}</p>
            )}
          </div>
        )}
      </div>
      {isEditing && (
          <button
              onClick={handleSave}
              className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
              Save Changes
          </button>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  
  return (
    <div>
      <Profile user={user!} />
    </div>
  );
}
