import mongoose, { Document, Schema } from "mongoose";
import { SCHEMAS_NAMES } from "../../const";
import { BaseModel } from "../core";
import { BaseSchema } from "../core/Base.model";

export class PostModel extends BaseModel {
  title!: string;
  body!: string;
  user!: string;
  photo_url?: string;
}

export const PostSchema = new BaseSchema<PostModel>({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  body: {
    type: String,
    required: [true, "body is required"],
  },
  photo_url: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: SCHEMAS_NAMES.USER_SCHEMA,
    required: [true, "userId is required"],
  },
});

export default mongoose.model<Document<PostModel>>(
  SCHEMAS_NAMES.POST_SCHEMA,
  PostSchema
);
