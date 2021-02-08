import BaseRepository from "../../repository/BaseRepository";
import { IUser } from "../../../models/users/user.schema";
import { IUserService } from "../../interfaces/";

export default class UserService
  extends BaseRepository<IUser>
  implements IUserService {}
