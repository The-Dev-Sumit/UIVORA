import mongoose from "mongoose";

// UserProfile document ka interface
interface IUserProfile extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  bio: string;
  avatar: string;
  skills: string[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new mongoose.Schema<IUserProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    socialLinks: {
      type: [
        {
          platform: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
            validate: {
              validator: function (v: string) {
                try {
                  new URL(v);
                  return true;
                } catch (e) {
                  return false;
                }
              },
              message: "Please enter a valid URL",
            },
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// socialLinks array ke liye validation
userProfileSchema.path("socialLinks").validate(function (links: any[]) {
  if (links.length > 10) return false;
  const texts = links.map((link) => link.text.toLowerCase());
  return texts.length === new Set(texts).size;
}, "Maximum 10 links allowed and link texts must be unique");

// Model ko export karo
const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", userProfileSchema);
export default UserProfile;
