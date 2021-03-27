import IBaseRepository from "../../repository/IBaseRepository";
import { CommentModel } from "../../../models/posts/post.schema";
import { IResponseBase } from "../../../models/core";

export default interface ICommentService extends IBaseRepository<CommentModel> {
  getAllComments(
    postId: string,
    page: number,
    qyt: number,
    isFull: Boolean
  ): Promise<IResponseBase>;
}
