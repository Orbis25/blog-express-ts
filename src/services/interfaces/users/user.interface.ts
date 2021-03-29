import IBaseRepository from "../../repository/IBaseRepository";
import { UserModel } from "../../../models/users/user.schema";
import fileUpload from "express-fileupload";
import { IResponseBase } from "../../../models/core";

export default interface IUserService extends IBaseRepository<UserModel> {
  uploadPic(files: fileUpload.FileArray | undefined, id:string): Promise<IResponseBase>;
}
