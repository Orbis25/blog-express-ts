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
}
