import IBaseRepository from "../../repository/IBaseRepository";
import { CommentModel } from "../../../models/comments/comment.model";
import { IResponseBase } from "../../../models/core";
import { Document } from "mongoose";

export default interface ICommentService extends IBaseRepository<CommentModel> {
  getAllComments(
    postId: string,
    page: number,
    qyt: number,
    isFull: Boolean
  ): Promise<IResponseBase>;
}
