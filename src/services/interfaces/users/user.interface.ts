import IBaseRepository from "../../repository/IBaseRepository";
import { UserModel } from "../../../models/users/user.schema";

export default interface IUserService extends IBaseRepository<UserModel> {}
