import IBaseRepository from "../../repository/IBaseRepository";
import { PostModel } from "../../../models/posts/post.schema";

export default interface IPostService extends IBaseRepository<PostModel> {}
