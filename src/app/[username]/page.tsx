"use client";

import { useParams } from "next/navigation";
import ProfilePage from "@/components/profile/ProfilePage";

const UserProfilePage = () => {
  const params = useParams();
  const username = params.username as string;

  return <ProfilePage username={username} />;
};

export default UserProfilePage;
