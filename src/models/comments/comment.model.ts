import { BaseModel, BaseSchema } from "../core/Base.model";
import mongoose, { Schema, Document } from "mongoose";
import { SCHEMAS_NAMES } from "../../const";

export class CommentModel extends BaseModel {
  text!: string;
  user!: string;
  post!: string;
}

export const CommentSchema = new BaseSchema<CommentModel>({
  text: {
    type: String,
    required: [true, "text is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: SCHEMAS_NAMES.USER_SCHEMA,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: SCHEMAS_NAMES.POST_SCHEMA,
    required: [true, "post is required"],
  },
});

export default mongoose.model<Document<CommentModel>>(
  SCHEMAS_NAMES.COMMENT_SCHEMA,
  CommentSchema
);
