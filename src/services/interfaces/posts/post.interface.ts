import IBaseRepository from "../../repository/IBaseRepository";
import { PostModel } from "../../../models/posts/post.schema";
import { LikeModel } from "../../../models/posts/like.schema";
import { IResponseBase } from "../../../models/core";

export default interface IPostService extends IBaseRepository<PostModel> {
  setLike(model: LikeModel): Promise<IResponseBase>;
  removeLike({
    user,
    post,
  }: {
    user: string;
    post: string;
  }): Promise<IResponseBase>;
  userLiked({
    user,
    post,
  }: {
    user: string;
    post: string;
  }): Promise<IResponseBase>;
}
