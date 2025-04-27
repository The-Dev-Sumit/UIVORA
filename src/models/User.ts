import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User document ka interface
export interface IUser extends mongoose.Document {
  email: string;
  username: string;
  name: string;
  image: string;
  password?: string;
  isOAuthUser?: boolean;
  googleId?: string;
  githubId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxLength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores and hyphens",
      ],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    image: {
      type: String,
      default: "",
    },
    isOAuthUser: {
      type: Boolean,
      default: false,
    },
    googleId: String,
    githubId: String,
  },
  {
    timestamps: true,
  }
);

// Password ko save karne se pehle hash karo
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || this.isOAuthUser || !this.password)
    return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Login ke liye password compare karo
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    if (this.isOAuthUser || !this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Model ko export karo
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
