import mongoose, { Document } from "mongoose";
import { SchemasNames } from "../../const";

const Schema = mongoose.Schema;

export interface IUser extends Document {
  name: String;
  createdAt: String;
  email: String;
  password: String;
  description: String;
  photoUrl: String;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  email: {
    type: String,
    required: [true, "EL correo es requerido"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
  },
  description: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
});

export default mongoose.model<Document<IUser>>(
  SchemasNames.USER_SCHEMA,
  UserSchema
);
