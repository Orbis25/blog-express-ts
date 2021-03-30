import mongoose, { Document, Schema } from "mongoose";
import { SCHEMAS_NAMES } from "../../const";
import { PROFILE_FOLDER } from "../../const/uploads.const";
import { BaseModel, BaseSchema } from "../core/Base.model";
import { PostModel } from "../posts/post.schema";

export class UserModel extends BaseModel {
  name!: string;
  email!: string;
  password!: string;
  description!: string;
  photoUrl!: string;
  password_hash!: string;
}

const UserSchema = new BaseSchema<UserModel>({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  email: {
    type: String,
    required: [true, "EL correo es requerido"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
  },
  password_hash: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
});

UserSchema.methods.toJSON = function () {
  var obj = this.toObject() as any;
  obj.photoUrl = process.env.FILE_UPLOADED + PROFILE_FOLDER + obj.photoUrl;
  delete obj.password;
  delete obj.password_hash;
  delete obj.__v;
  return obj;
};

export default mongoose.model<Document<UserModel>>(
  SCHEMAS_NAMES.USER_SCHEMA,
  UserSchema
);

/*********View Models********/

export class UserAuthViewModel {
  email!: string;
  password!: string;
}
