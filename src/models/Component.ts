import mongoose from "mongoose";

export interface IComponent {
  name: string;
  type: "html" | "react";
  code: {
    html?: string;
    css?: string;
    js?: string;
    jsx?: string;
  };
  userId: string;
  metadata?: {
    language?: string;
    useTailwind?: boolean;
    tag?: string;
  };
  tag?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ComponentSchema = new mongoose.Schema<IComponent>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["html", "react"], required: true },
    code: {
      html: String,
      css: String,
      js: String,
      jsx: String,
    },
    userId: { type: String, required: true },
    metadata: {
      language: String,
      useTailwind: Boolean,
      tag: String,
    },
    tag: String,
  },
  { timestamps: true }
);

export const Component =
  mongoose.models.Component ||
  mongoose.model<IComponent>("Component", ComponentSchema);

export default Component;
