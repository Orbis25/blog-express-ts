import mongoose, { Document, Schema } from "mongoose";
import { SCHEMAS_NAMES } from "../../const";
import { POST_FOLDER } from "../../const/uploads.const";
import { BaseModel } from "../core";
import { BaseSchema } from "../core/Base.model";

export class PostModel extends BaseModel {
  title!: string;
  body!: string;
  user!: string;
  photo_url?: string;
}

const PostSchema = new BaseSchema<PostModel>({
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
    required: [true, "user is required"],
  },
});

PostSchema.methods.toJSON = function () {
  let obj = this.toObject() as PostModel;
  obj.photo_url = process.env.FILE_UPLOADED + POST_FOLDER + obj.photo_url;
  delete obj.__v;
  return obj;
};

export default mongoose.model<Document<PostModel>>(
  SCHEMAS_NAMES.POST_SCHEMA,
  PostSchema
);
