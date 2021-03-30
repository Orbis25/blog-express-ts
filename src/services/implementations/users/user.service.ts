import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import BaseRepository from "../../repository/BaseRepository";
import userSchema, {
  UserModel,
  UserAuthViewModel,
} from "../../../models/users/user.schema";
import { IUserService } from "../../interfaces/";
import IResponseBase from "../../../models/core/Response.model";
import { STATE } from "../../../models/enums/State.enum";
import fileUpload from "express-fileupload";
import fs from "fs";
import { moveFile } from "../../../utils/helpers/files.helpers";
import path from "path";
import { PROFILE_FOLDER } from "../../../const/uploads.const";
export default class UserService
  extends BaseRepository<UserModel>
  implements IUserService {
  async save(model: UserModel): Promise<IResponseBase> {
    const exist = await userSchema.findOne({
      email: model.email,
      state: STATE.ACTIVE,
    });
    if (exist) return { ok: false, error: `the ${model.email} all ready used` };
    model.password_hash = await this.generateSalt();
    model.password = await bcrypt.hash(model.password, model.password_hash);
    return await this.create(new userSchema(model));
  }

  async login(model: UserAuthViewModel): Promise<IResponseBase> {
    try {
      //get the entity
      const doc = await userSchema.findOne({
        email: model.email,
        state: STATE.ACTIVE,
      });

      //conver to typed model
      const result = (doc as unknown) as UserModel;

      if (!result) return { ok: false, error: "entity not found" };
      //validate password
      const isValid = await this.passwordIsValid(
        model.password,
        result.password
      );
      if (!isValid) return { ok: false, error: "invalid login" };

      //generate a token
      return {
        ok: true,
        result: {
          token: jwt.sign({ result }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1h",
            issuer: process.env.JWT_ISSUER as string,
            audience: process.env.JWT_AUDIENCE as string,
          }),
          user: result,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  private async generateSalt(): Promise<string> {
    return await bcrypt.genSalt(15);
  }

  private async passwordIsValid(
    password: string,
    hash: string
  ): Promise<Boolean> {
    return await bcrypt.compare(password, hash);
  }

  private async removeImageProfile(id: string, path: string) {
    const filter = { state: STATE.ACTIVE, _id: id } as any;
    const user = await userSchema.findOne(filter);
    if (user) {
      const result = (user as unknown) as UserModel;
      if (result.photoUrl) {
        try {
          if (fs.existsSync(path + result.photoUrl)) {
            fs.unlinkSync(path + result.photoUrl);
          }
        } catch (error) {
          throw new Error(error);
        }
      }
    }
  }

  async uploadPic(
    files: fileUpload.FileArray | undefined,
    id: string
  ): Promise<IResponseBase> {
    const { profile_pic } = files as any;

    if (!files || Object.keys(files).length === 0)
      return { ok: false, error: "file required" };

    const base_path =
      (process.env.FILE_DESTINATION as string) || "/public/uploads/";
    const file_path = process.cwd() + base_path + PROFILE_FOLDER;
    const newFile = Date.now() + id + path.extname(profile_pic.name);

    //if user have image remove this
    await this.removeImageProfile(id, file_path);

    if (fs.existsSync(file_path)) {
      const result = await moveFile(profile_pic, file_path + newFile);
      if (result) return { ok: false, result: "error upload file" };
      await this.update(id, { photoUrl: newFile } as UserModel, userSchema);
      return { ok: true, result: "uploaded file" };
    } else {
      fs.mkdirSync(file_path, { recursive: true });
      const result = await moveFile(profile_pic, file_path + newFile);
      if (result) return { ok: false, result: "error upload file" };
      await this.update(id, { photoUrl: newFile } as UserModel, userSchema);
      return { ok: true, result: "uploaded file" };
    }
  }
}
