import { BaseModel, BaseSchema } from "../core/Base.model";
import { UserModel } from "../users/user.schema";
import { PostModel } from "../posts/post.schema";
import mongoose, { Schema, Document } from "mongoose";
import { SCHEMAS_NAMES } from "../../const";

export class CommentModel extends BaseModel {
  text!: string;
  user!: UserModel;
  post!: PostModel;
}

export const CommentSchema = new BaseSchema<CommentModel>({
  text: {
    type: String,
    require: [true, "text is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: SCHEMAS_NAMES.USER_SCHEMA,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: SCHEMAS_NAMES.POST_SCHEMA,
  },
});

export default mongoose.model<Document<CommentModel>>(
  SCHEMAS_NAMES.COMMENT_SCHEMA,
  CommentSchema
);
