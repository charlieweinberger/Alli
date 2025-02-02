
import { useState, useEffect } from "react";
import { User } from "../lib/types";

import { useRouter } from "next/navigation";

type ProfileProps = {
    user: User;
};

export default function Profile({ user }: ProfileProps) {
    return (
        <div className="profile-container">
            <h1>{user.name}</h1>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Pronouns:</strong> {user.pronouns}</p>
            {user.genderIdentity && <p><strong>Gender Identity:</strong> {user.genderIdentity}</p>}
            {user.sexuality && <p><strong>Sexuality:</strong> {user.sexuality}</p>}
            {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
            {user.hobbies && <p><strong>Hobbies:</strong> {user.hobbies}</p>}
            {user.major && <p><strong>Major:</strong> {user.major}</p>}
            {user.age && <p><strong>Age:</strong> {user.age}</p>}
        </div>
    );
} 