"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { MdOutlineLink } from "react-icons/md";
import Loader from "@/components/loader/Loader";
import { IoArrowBackSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  socialLinks?: {
    platform: string;
    url: string;
    text: string;
  }[];
}

export default function UserProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${username}`);
        console.log("Profile data:", response.data); // Debug log
        setProfile(response.data);
      } catch (error) {
        toast.error("Failed to load profile");
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  const handleBack = () => {
    router.back();
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-5">
      <button
        onClick={handleBack}
        className="text-white cursor-pointer link-underline flex items-center gap-1 px-1">
        <IoArrowBackSharp className="h-4 w-4 mt-1" />
        <span className="capitalize">back</span>
      </button>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gray-800/90 p-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-600">
                    <span className="text-4xl text-gray-300">
                      {profile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.username}</h1>
                <p className="text-blue-200">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Bio */}
            {profile.bio && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">
                  Bio
                </h2>
                <p className="text-gray-400">{profile.bio}</p>
              </div>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-200 mb-2">
                  Social Links
                </h2>
                <div className=" gap-4 block">
                  {profile.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium flex items-center gap-2 capitalize text-blue-300 hover:text-blue-300 px-2 transition-colors ">
                      <MdOutlineLink className="h-4 w-4 mt-1" />
                      <span className="capitalize link-underline-social">
                        {link.text}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
