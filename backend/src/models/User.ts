import mongoose, { Document, Schema } from "mongoose";

// This defines what a User looks like in MongoDB
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // will be stored as a hashed value, never plain text
  createdAt: Date;
  resetPasswordToken?: string;   // set when a password reset is requested
  resetPasswordExpires?: Date;  // token is invalid after this time
}

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },

    // Both fields below are only ever set while a reset is in progress.
    // select: false keeps them out of normal queries (e.g. GET /me),
    // the same way the password field is meant to stay hidden.
    resetPasswordToken:   { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true } // auto-adds createdAt and updatedAt
);

export default mongoose.model<IUser>("User", UserSchema);