import { Mongoose } from "mongoose";

declare global {
  let mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}
