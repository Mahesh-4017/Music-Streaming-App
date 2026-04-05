import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;   // Optional for OAuth users
  avatar?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },          // bcrypt hash; absent for Google users
    avatar:   { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;