import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ComponentTag } from "@/components/TagSelectionModal";

export interface IComponent {
  _id?: ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  type: "html" | "react";
  code: {
    html?: string;
    css?: string;
    js?: string;
    jsx?: string;
    language?: "js" | "ts";
    useTailwind?: boolean;
  };
  metadata?: {
    type?: string;
    language?: string;
    useTailwind?: boolean;
    tag?: ComponentTag;
  };
  tag: ComponentTag;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComponentWithId extends IComponent {
  _id: ObjectId;
}

const componentSchema = new mongoose.Schema<IComponent>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["html", "react"],
      required: true,
    },
    code: {
      html: String,
      css: String,
      js: String,
      jsx: String,
      language: {
        type: String,
        enum: ["js", "ts"],
      },
      useTailwind: Boolean,
    },
    metadata: {
      type: {
        type: String,
      },
      language: String,
      useTailwind: Boolean,
      tag: {
        type: String,
        enum: ["all", "buttons", "texts", "cards", "backgrounds"],
      },
    },
    tag: {
      type: String,
      enum: ["all", "buttons", "texts", "cards", "backgrounds"],
      required: true,
      default: "all",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Component =
  mongoose.models.Component ||
  mongoose.model<IComponent>("Component", componentSchema);
