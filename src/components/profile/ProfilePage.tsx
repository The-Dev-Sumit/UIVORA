"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { AiOutlineBook } from "react-icons/ai";
import { FaSkating } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { RiCameraAiFill } from "react-icons/ri";
import CancelButton from "../CancelButton";
import EditButton from "../EditButton";
import SaveButton from "../SaveButton";
import AddRemoveButton from "../AddRemoveButton";
import { GiCrossMark } from "react-icons/gi";
import { MdOutlineLink } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/loader/Loader";

interface SocialLink {
  platform: string;
  url: string;
}

interface UserProfile {
  username: string;
  email: string;
  bio: string;
  avatar: string;
  skills: string[];
  socialLinks: SocialLink[];
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
      details?: string;
    };
  };
  message: string;
}

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
    bio: "",
    avatar: "",
    skills: [],
    socialLinks: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newLinkType, setNewLinkType] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const devMode = process.env.NEXT_PUBLIC_DEV_MODE;

  useEffect(() => {
    if (devMode === "skip_auth") {
      setProfile({
        username: "Dev User",
        email: "dev@example.com",
        bio: "This is a mock bio for development purposes.",
        avatar: "",
        skills: ["test_skill_1", "test_skill_2"],
        socialLinks: [{ platform: "website", url: "https://example.com" }],
      });
      setIsLoading(false);
    } else if (status === "authenticated") {
      fetchProfileData();
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, devMode]);

  // Fetch profile data
  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/user/profile");
      if (response.data) {
        setProfile({
          username: response.data.username || "",
          email: response.data.email || "",
          bio: response.data.bio || "",
          avatar: response.data.avatar || "",
          skills: response.data.skills || [],
          socialLinks: Array.isArray(response.data.socialLinks)
            ? response.data.socialLinks
            : [],
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Save profile data
  const handleSave = async () => {
    if (devMode === "skip_auth") {
      toast.success("Profile save simulated in dev mode!");
      setIsEditing(false);
      return;
    }

    try {
      if (!session?.user?.email) {
        toast.error("Please login to save profile");
        return;
      }

      const profileData = {
        username: profile.username || "",
        bio: profile.bio || "",
        socialLinks: profile.socialLinks || [],
        skills: profile.skills || [],
        avatar: profile.avatar || "",
        email: session.user.email,
      };

      console.log("Saving profile data:", profileData);

      const response = await axios.put("/api/user/profile", profileData);

      if (response.data) {
        setProfile((prev) => ({
          ...prev,
          ...response.data,
        }));
        await fetchProfileData(); // Refresh data after save
        if (update) await update(); // Refresh session so username updates everywhere
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.details ||
        "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  // Save individual sections
  const saveProfileSection = async (sectionData: Partial<UserProfile>) => {
    if (devMode === "skip_auth") {
      toast.success("Section save simulated in dev mode!");
      if (sectionData.skills) {
        setProfile((prev) => ({ ...prev, skills: sectionData.skills! }));
      }
      return;
    }

    try {
      if (!session?.user?.email) {
        toast.error("Please login to save profile");
        return;
      }

      // Only include username if it's being updated
      const updatedData: any = {
        ...sectionData,
        email: session.user.email,
      };
      if (sectionData.username !== undefined) {
        updatedData.username = sectionData.username;
      }

      console.log("Saving section data:", updatedData);

      const response = await axios.put("/api/user/profile", updatedData);
      if (response.data) {
        setProfile((prev) => ({
          ...prev,
          ...response.data,
        }));
        await fetchProfileData(); // Refresh data after save
        toast.success("Section updated successfully");
      }
    } catch (error: unknown) {
      console.error("Error updating section:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.details ||
        "Failed to update section";
      toast.error(errorMessage);
    }
  };

  const handleAddSkill = async () => {
    if (newSkill && !profile.skills?.includes(newSkill)) {
      const updatedSkills = [...(profile.skills || []), newSkill];
      if (devMode === "skip_auth") {
        setProfile((prev) => ({ ...prev, skills: updatedSkills }));
        setNewSkill("");
        toast.success("Mock skill added!");
        return;
      }
      await saveProfileSection({ skills: updatedSkills });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedSkills =
      profile.skills?.filter((skill) => skill !== skillToRemove) || [];
    if (devMode === "skip_auth") {
      setProfile((prev) => ({ ...prev, skills: updatedSkills }));
      toast.success("Mock skill removed!");
      return;
    }
    await saveProfileSection({ skills: updatedSkills });
  };

  const handleAddLink = async () => {
    if (newLinkType && newLinkUrl) {
      let validUrl = newLinkUrl.trim();
      if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
        validUrl = `https://${validUrl}`;
      }

      try {
        new URL(validUrl);
      } catch (error) {
        toast.error("Please enter a valid website URL");
        return;
      }

      const newLink = {
        platform: newLinkType.trim(),
        url: validUrl,
      };
      const updatedLinks = [...(profile.socialLinks || []), newLink];

      if (devMode === "skip_auth") {
        setProfile((prev) => ({ ...prev, socialLinks: updatedLinks }));
        setNewLinkType("");
        setNewLinkUrl("");
        toast.success("Mock link added!");
        return;
      }

      try {
        const response = await axios.put("/api/user/profile", {
          username: profile.username,
          bio: profile.bio || "",
          avatar: profile.avatar || "",
          skills: profile.skills || [],
          socialLinks: updatedLinks,
        });

        if (response.data) {
          setProfile((prev) => ({
            ...prev,
            socialLinks: Array.isArray(response.data.socialLinks)
              ? response.data.socialLinks
              : [],
          }));
          toast.success("Link added successfully");
          setNewLinkType("");
          setNewLinkUrl("");
        }
      } catch (error: any) {
        console.error("Error adding link:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.details ||
          "Failed to add link";
        toast.error(errorMessage);
      }
    } else {
      toast.error("Please enter both link text and URL");
    }
  };

  const handleRemoveLink = async (platform: string) => {
    const updatedLinks =
      profile.socialLinks?.filter((link) => link.platform !== platform) || [];
    if (devMode === "skip_auth") {
      setProfile((prev) => ({ ...prev, socialLinks: updatedLinks }));
      toast.success("Mock link removed!");
      return;
    }

    try {
      setProfile((prev) => ({
        ...prev,
        socialLinks: updatedLinks,
      }));

      const response = await axios.put("/api/user/profile", {
        username: profile.username,
        socialLinks: updatedLinks,
      });

      if (response.data) {
        setProfile((prev) => ({
          ...prev,
          socialLinks: Array.isArray(response.data.socialLinks)
            ? response.data.socialLinks
            : [],
        }));
        toast.success("Link removed successfully");
      }
    } catch (error: any) {
      console.error("Error removing link:", error);
      toast.error(error.response?.data?.error || "Failed to remove link");
      await fetchProfileData();
    }
  };

  const handleBioChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    setProfile((prev) => ({
      ...prev,
      bio: newBio,
    }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({
      ...prev,
      username: e.target.value,
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // Update profile with new avatar
        const response = await axios.put("/api/user/profile", {
          ...profile,
          avatar: base64String,
        });

        if (response.data) {
          setProfile((prev) => ({
            ...prev,
            avatar: response.data.avatar,
          }));
          toast.success("Avatar updated successfully");
        } else {
          throw new Error("Failed to update avatar");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar");
    }
  };

  const AddSvg = (
    <svg
      className="text-white"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g id="Edit / Add_Plus">
          {" "}
          <path
            id="Vector"
            d="M6 12H12M12 12H18M12 12V18M12 12V6"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"></path>{" "}
        </g>{" "}
      </g>
    </svg>
  );

  if (isLoading && devMode !== "skip_auth") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center text-white justify-between mb-6">
          <h1 className="text-3xl text-white lemonada-sem tracking-wider">
            {session?.user?.email ? "Profile" : "Please login to view profile"}
          </h1>
          {session?.user?.email && !isEditing ? (
            <EditButton onClick={() => setIsEditing(true)} />
          ) : session?.user?.email && isEditing ? (
            <div className="flex gap-2">
              <SaveButton
                handleSave={async () => {
                  await handleSave();
                }}
                cancelEditing={() => setIsEditing(false)}
              />
              <CancelButton onClick={() => setIsEditing(false)} />
            </div>
          ) : null}
        </div>

        <div className="space-y-6 text-white">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={`${profile.username}'s avatar`}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <FaCircleUser className="w-24 h-24 text-gray-400" />
                )}
                {session?.user?.email && isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <RiCameraAiFill className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      title="Upload profile picture"
                      aria-label="Upload profile picture"
                      id="avatar-upload"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {session?.user?.email && isEditing ? (
                <>
                  <label className="flex items-center font-medium text-gray-300 mb-1">
                    <FaCircleUser className="w-4 h-4 mr-2" />
                    <span className="text-sm">Username</span>
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={handleUsernameChange}
                    title="Username"
                    placeholder="Enter username"
                    className="w-[80%] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <FaCircleUser className="w-4 h-4" />
                  <p className="text-gray-300 delius-unicase-bold">
                    {profile.username || "User"}
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <HiOutlineMail className="w-4 h-4" />
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
              </div>
              <p className="text-gray-300">
                {session?.user?.email || profile.email || "Email not available"}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                <AiOutlineBook />
                <span>Bio</span>
              </label>
              {session?.user?.email && isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={handleBioChange}
                  onBlur={() => saveProfileSection({ bio: profile.bio })}
                  title="Bio"
                  placeholder="Enter bio"
                  rows={4}
                  className="w-[80%] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-400 whitespace-pre-line">
                  {profile.bio || "No bio yet"}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-300">
                <FaSkating />
                <span>Skills</span>
              </h3>
              {session?.user?.email && isEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g., React, Node.js)"
                      title="Skill"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <AddRemoveButton
                      onClick={handleAddSkill}
                      text="Add Skill"
                      className="bg-blue-600 text-blue-100"
                      AddSvg={AddSvg}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center justify-center gap-2 bg-gray-700/80 px-3 py-[.2rem] rounded-xl">
                        <span className="mb-1">{skill}</span>
                        <button
                          title="Remove Skill"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-red-500 hover:text-red-700">
                          <GiCrossMark className="text-md cursor-pointer" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-700/80 font-semibold tracking-wider comic-neue-regular text-blue-300 pb-1 px-4 rounded-xl">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Social Links Section */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-300">
                <FaLink />
                <span>Social Links</span>
              </h3>
              <div className="space-y-4 mt-2">
                {session?.user?.email && isEditing ? (
                  <>
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-row items-center justify-center gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Link Text
                          </label>
                          <input
                            type="text"
                            value={newLinkType}
                            onChange={(e) => setNewLinkType(e.target.value)}
                            placeholder="e.g., Portfolio, GitHub, LinkedIn"
                            title="Link Text"
                            className="lg:w-[22vw] px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-700 text-white placeholder-gray-400"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-300">
                            Website URL
                          </label>
                          <input
                            type="text"
                            value={newLinkUrl}
                            onChange={(e) => setNewLinkUrl(e.target.value)}
                            placeholder="e.g., http://example.com"
                            title="Website URL"
                            className="px-3 lg:w-[22vw] py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-700 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>
                      <div className="flex-1 mt-4">
                        <AddRemoveButton
                          onClick={handleAddLink}
                          className="bg-blue-600 text-blue-100"
                          AddSvg={AddSvg}
                          text="Add Link"
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                <div className="space-y-2">
                  {Array.isArray(profile.socialLinks) &&
                    profile.socialLinks.map((link) => (
                      <div
                        key={link.platform}
                        className="flex items-center px-2 rounded-lg">
                        <div className="flex items-center justify-center rounded-md py-[.2rem]">
                          <MdOutlineLink className="w-4 h-4 mt-1" />
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium capitalize text-blue-300 hover:text-blue-300 px-2 transition-colors link-underline-social">
                            {link.platform}
                          </a>
                        </div>
                        {session?.user?.email && isEditing && (
                          <button
                            title="Remove Link"
                            onClick={() => handleRemoveLink(link.platform)}
                            className="text-red-500 hover:text-red-600 px-2 py-1 rounded">
                            <GiCrossMark className="w-4 h-4 cursor-pointer" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
