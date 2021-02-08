import IBaseRepository from "../../repository/IBaseRepository";
import { IUser } from "../../../models/users/user.schema";

export default interface IUserService extends IBaseRepository<IUser> {}
