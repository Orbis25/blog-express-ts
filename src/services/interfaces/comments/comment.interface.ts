import IBaseRepository from "../../repository/IBaseRepository";
import { CommentModel } from "../../../models/comments/comment.model";

export default interface ICommentService
  extends IBaseRepository<CommentModel> {}
