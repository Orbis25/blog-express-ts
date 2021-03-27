import mongoose, { Schema, Document } from "mongoose";
import { SCHEMAS_NAMES } from "../../const";
import { BaseModel, BaseSchema } from "../core/Base.model";

export class LikeModel extends BaseModel {
  user!: string;
  post!: string;
}

const LikeSchema = new BaseSchema({
  user: {
    type: Schema.Types.ObjectId,
    ref: SCHEMAS_NAMES.USER_SCHEMA,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: SCHEMAS_NAMES.POST_SCHEMA,
  },
});

export default mongoose.model<Document<LikeModel>>(
  SCHEMAS_NAMES.LIKE_SCHEMA,
  LikeSchema
);
